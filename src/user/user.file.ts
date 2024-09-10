import { PipeTransform, Injectable, ArgumentMetadata, FileValidator } from '@nestjs/common';
import { IFile } from '@nestjs/common/pipes/file/interfaces';

export type UserFileValidatorOptions = {
};

export class UserFileTypeValidator extends FileValidator<
  UserFileValidatorOptions,
  IFile
> {
  buildErrorMessage(): string {
    return 'O tipo de arquivo deve ser uma PNG!';
  }

  isValid(file?: IFile): boolean {
    return (
      !!file && 
      'mimetype' in file &&
      !!file.mimetype.match('image/png')
    );
  }
}

export class UserFileSizeValidator extends FileValidator<
  UserFileValidatorOptions,
  IFile
> {
  maxSize(): number {
    return this.maxSizeInKB() * 1024;
  }

  maxSizeInKB(): number {
    return 512;
  }

  buildErrorMessage(): string {
    return 'Arquivo maior que ' + this.maxSizeInKB() + 'KB!';
  }

  isValid(file?: IFile): boolean {
    return (
      !!file && file.size <= this.maxSize()
    );
  }
}