import * as Yup from 'yup';
import { parseISO, addMonths, isBefore } from 'date-fns';

import Plan from '../models/Plan';
import Student from '../models/Student';
import Enrollment from '../models/Enrollment';

class EnrollmentController {
  async index(req, res) {
    const enrollments = await Enrollment.findAll();

    return res.json(enrollments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const enrollment = req.body;

    /**
     * Search data of chosen plan
     */
    const plan = await Plan.findByPk(enrollment.plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists!' });
    }

    /**
     * Search data of chosen student
     */
    if (!(await Student.findByPk(enrollment.student_id))) {
      return res.status(400).json({ error: 'Student not exists!' });
    }

    enrollment.start_date = parseISO(enrollment.start_date);

    /**
     * Check for past dates
     */
    if (isBefore(enrollment.start_date, new Date())) {
      return res.status(400).json({ error: 'Past dates are note permitted' });
    }

    enrollment.price = plan.getTotalPrice();
    enrollment.end_date = addMonths(enrollment.start_date, plan.duration);

    return res.json(await Enrollment.create(enrollment));
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number(),
      start_date: Yup.date().when('plan_id', (plan_id, field) =>
        plan_id ? field.required() : field
      ),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { start_date, plan_id } = req.body;
    const { id, student_id } = req.params;

    /**
     * Check for past dates
     */
    if (isBefore(parseISO(start_date), new Date())) {
      return res.status(400).json({ error: 'Past dates are note permitted' });
    }

    const enrollment = await Enrollment.findOne({ where: { id, student_id } });

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists!' });
    }

    if (plan_id) {
      const newPlan = await Plan.findByPk(plan_id);

      if (!newPlan) {
        return res
          .status(400)
          .json({ error: 'The selected plan does not exist' });
      }

      enrollment.price = newPlan.getTotalPrice();
    }

    enrollment.update(req.body);

    return res.json(enrollment);
  }

  async delete(req, res) {
    const { id, student_id } = req.params;

    const enrollment = await Enrollment.findOne({ where: { id, student_id } });

    if (!enrollment) {
      return res.status(400).json({ error: 'Enrollment does not exists!' });
    }

    enrollment.destroy();

    return res.status(200).json({ success: 'Enrollment deleted with success!' });
  }
}

export default new EnrollmentController();
