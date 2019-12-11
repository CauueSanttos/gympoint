import { parseISO, format } from 'date-fns';
import pt from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class HelpOrderAnswer {
  get key() {
    return 'HelpOrderAnswer';
  }

  async handle({ data }) {
    const { help_order } = data;

    await Mail.sendMail({
      to: `${help_order.student.name} <${help_order.student.email}>`,
      subject: 'Pedido de Auxilio - GymPoint',
      template: 'answer-help-order',
      context: {
        question: help_order.question,
        answer: help_order.answer,
        student: help_order.student.name,
        answer_date: format(
          parseISO(help_order.answer_at),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        created_help_date: format(
          parseISO(help_order.createdAt),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new HelpOrderAnswer();
