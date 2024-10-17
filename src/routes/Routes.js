import express from 'express'
import { eventsController } from '../controllers/EventsController.js';
import { registrationController } from '../controllers/RegistrationController.js';
import { authController } from '../controllers/AuthController.js';
import { validationResult } from 'express-validator'
import { logger } from './Logger.js';


const validate = validations => {
  return async (req, res, next) => {
    for (let validation of validations) {
      const result = await validation.run(req);
      if (result.errors.length) break;
    }

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    logger.error("[VALIDATION]", { errors: errors.array() } )
    res.status(400).json({ errors: errors.array() });
  };
};

const router = express.Router();

router.validatablePost = (path, controllerHandler) => {
    router.post(path, validate(controllerHandler.validation), async (req, res) => {
      try {
        await controllerHandler.handler(req, res)
      } catch (e) {
        console.log(e.message)
        logger.error("[CONTROLLER]", { e })
        res.status(400).json({ e });
      }
    } 
  )
}

router.validatableGet = (path, controllerHandler) => {
    router.get(path, validate(controllerHandler.validation), async (req, res) => {
      try {
        await controllerHandler.handler(req, res)
      } catch (e) {
        console.log(e.message)
        logger.error("[CONTROLLER]", { e })
        res.status(400).json({ e });
      }
    })
}

const jwtMiddleware = authController.auth;


router.use(async (req, res, next) => {
  logger.info("[RECEIVE REQUEST]", { API: req.originalUrl });
  return next();
})

router.validatableGet('/events/get', eventsController.getEvents)
router.validatableGet('/events/count', eventsController.getCount)
router.validatablePost('/events/create', eventsController.createEvent)
router.validatableGet('/registration/get', registrationController.getRegistration)
router.validatableGet('/registration/today', registrationController.getTodayEventRegistrationsCount)
router.validatablePost('/registration/create', registrationController.createRegistraionForEvent)

router.validatablePost('/user/register', authController.register)
router.validatablePost('/user/login', authController.login)

export { router }