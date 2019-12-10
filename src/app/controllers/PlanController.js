import * as Yup from 'yup';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      duration: Yup.number().required(),
      title: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      duration: Yup.number(),
      title: Yup.string(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails!' });
    }

    const plan = await Plan.findOne({
      where: { id: req.params.id },
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists!' });
    }

    plan.update(req.body);

    return res.json(plan);
  }

  async delete(req, res) {
    const plan = await Plan.findOne({
      where: { id: req.params.id },
    });

    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists!' });
    }

    await plan.destroy();

    return res.json({ success: 'Plan deleted successful!' });
  }
}

export default new PlanController();
