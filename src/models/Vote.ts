export default class Vote{
  voterAddress: string;
  message: string;
  castOn: Date;
  candidateId: number;

    constructor(voterAddress: string, message: string, castOn: Date, candidateId: number) {
    this.voterAddress = voterAddress;
    this.message=message;
    this.castOn=castOn;
    this.candidateId=candidateId;
  }
  
}