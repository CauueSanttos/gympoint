import * as Yup from 'yup';
import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (await Student.findOne({ where: { email: req.body.email } })) {
      return res.status(400).json({ error: 'User already exists!' });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({
      id,
      name,
      email,
      age,
      weight,
      height,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      newEmail: Yup.string().email(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Student.findOne({ where: { email } });

    if (!student) {
      return res.status(401).json({ error: 'Student not exists!' });
    }

    const updateUser = req.body;

    if (updateUser.newEmail) {
      updateUser.email = updateUser.newEmail;
    }

    const { id, name, age, weight, height } = await student.update(updateUser);

    return res.json({
      id,
      name,
      email: updateUser.email,
      age,
      weight,
      height,
    });
  }
}

export default new StudentController();
