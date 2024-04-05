import { SuccessfullyMessage } from './SuccessfullyMessage';

export class SuccessfullyUpdated extends SuccessfullyMessage {
  constructor(message = 'Registro atualizado com sucesso!') {
    super(message);
  }
}
