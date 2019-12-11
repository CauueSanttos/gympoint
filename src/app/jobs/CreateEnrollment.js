import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class CreateEnrollment {
  get key() {
    return 'CreateEnrollment';
  }

  async handle({ data }) {
    const { enrollment, student, plan } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Cadastrada - GymPoint',
      template: 'create-enrollment',
      context: {
        student: student.name,
        enrollment: enrollment.id,
        plan: plan.title,
        enrollmentPrice: `R$ ${enrollment.price},00`,
        endDate: format(
          parseISO(enrollment.end_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new CreateEnrollment();
