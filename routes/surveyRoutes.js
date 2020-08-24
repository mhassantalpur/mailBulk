const _ = require('lodash');
const { Path } = require('path-parser');
const { URL } = require('url');
const mongoose = require('mongoose');
const requireLogin = require('../middlewares/requireLogin');
const requireCredits = require('../middlewares/requireCredits');
const Mailer = require('../services/Mailer');
const surveyTemplate = require('../services/emailTemplates/surveyTemplate');

const Survey = mongoose.model('surveys');

module.exports = app => {
  app.get('/api/surveys', requireLogin, async (req, res) => {
    const surveys = await Survey.find({ _user: req.user.id })
      .select({ recipients: false });
    res.send(surveys);
  });

  app.get('/api/surveys/:surveyId/:choice', (req,res) => {
    res.send('Thank You for your Feedback!');
  });

  // app.post('/api/surveys/webhooks', (req,res) => {
  //   const events = _.map(req.body, (event) => {
  //     const pathname = new URL(event.url).pathname;
  //     const p = new Path('/api/surveys/:surveyId/:choice');
  //     p.test(pathname);
  //     const match = p.test(pathname);
  //     if (match) {
  //       return {email: event.email, surveyId: match.surveyId, choice: match.choice};
  //     }
  //   });
  //   const compactEvents = _.compact(events); //returns event objects, filters undefined
  //   const uniqueEvents = _.uniqBy(compactEvents, 'email', 'surveyId');
  //
  //   console.log(uniqueEvents);
  //   res.send({});
  // });

  app.post('/api/surveys/webhooks', (req,res) => {
    const p = new Path('/api/surveys/:surveyId/:choice');

    _.chain(req.body)
      .map((event) => {
        const match = p.test(new URL(event.url).pathname);
        if (match) {
          return {email: event.email, surveyId: match.surveyId, choice: match.choice};
        }
      })
      .compact() //returns event objects, filters undefined
      .uniqBy('email', 'surveyId')
      .each(({ surveyId, email, choice}) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1},
            $set: { 'recipients.$.responded': true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    res.send({});
  });

  app.post('/api/surveys', requireLogin, requireCredits, async (req,res) => {
    const { title, subject, body, recipients } = req.body;

    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(',').map((email) => ({ email: email.trim() })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    try {
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();
      await survey.save();

      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      res.status(422).send(err);
    }
  });
}
