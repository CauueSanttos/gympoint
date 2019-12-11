import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import HelpOrderAnswer from '../jobs/HelpOrderAnswer';
import Queue from '../../lib/Queue';

class HelpOrderController {
  async index(req, res) {
    const { student_id } = req.params;

    if (student_id) {
      /**
       * Check the student exists
       */
      if (!(await Student.findByPk(student_id))) {
        return res.status(400).json({ error: 'Student not exists!' });
      }

      const help_oders_user = await HelpOrder.findAll({
        where: {
          student_id,
        },
        attributes: ['id', 'question', 'createdAt', 'student_id'],
        include: [
          {
            model: Student,
            as: 'student',
            attributes: ['name', 'email'],
          },
        ],
      });

      return res.json(help_oders_user);
    }

    const help_orders = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      attributes: ['id', 'question', 'createdAt', 'student_id'],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    return res.json(help_orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { student_id } = req.params;

    /**
     * Check student exists
     */
    if (!(await Student.findByPk(student_id))) {
      return res.status(400).json({ error: 'The student does not exists!' });
    }

    const help_order = await HelpOrder.create({
      student_id,
      question: req.body.question,
    });

    return res.json(help_order);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const { id, student_id } = req.params;

    /**
     * Check help order exists
     */
    const help_order = await HelpOrder.findOne({
      where: {
        id,
        student_id,
        answer: null,
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['name', 'email'],
        },
      ],
    });

    if (!help_order) {
      return res.status(400).json({ error: 'Help order does not exists!' });
    }

    const { answer } = req.body;

    const help_order_answer = await help_order.update({
      answer,
      answer_at: new Date(),
    });

    /**
     * Send email to student
     */
    await Queue.add(HelpOrderAnswer.key, {
      help_order: help_order_answer,
    });

    return res.json(help_order_answer);
  }
}

export default new HelpOrderController();
