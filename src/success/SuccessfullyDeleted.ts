import { SuccessfullyMessage } from './SuccessfullyMessage';

export class SuccessfullyDeleted extends SuccessfullyMessage {
  constructor(message = 'Registro deletado com sucesso!') {
    super(message);
  }
}
