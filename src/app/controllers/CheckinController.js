import { startOfDay, endOfDay, addWeeks } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { student_id } = req.params;

    if (!(await Student.findAll({ student_id }))) {
      return res.status(400).json({ error: 'The student does not exists!' });
    }

    const checkins = await Checkin.findAll({
      where: { student_id },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    /**
     * Check student exists
     */
    const { student_id } = req.params;

    if (!(await Student.findByPk(student_id))) {
      return res.status(400).json({ error: 'The student does not exists!' });
    }

    /**
     * Check the student have five checkins
     */
    const checkins = await Checkin.findAll({
      where: {
        created_at: {
          [Op.between]: [
            startOfDay(new Date()),
            endOfDay(addWeeks(new Date(), 1)),
          ],
        },
        student_id,
      },
    });

    if (checkins.length > 4) {
      return res
        .status(401)
        .json({ error: 'You have exceeded the limit of 5 weekly checkins' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }
}

export default new CheckinController();
