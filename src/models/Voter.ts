export default class Vote{
  voterAddress: string
  totalVotes: number
  firstVote:  Date;
  latestVote: Date;
  votes: number[]; 

  constructor(voterAddress: string, totalVotes: number, firstVote: Date, latestVote: Date, votes: number[]) {
    this.voterAddress = voterAddress;
    this.totalVotes=totalVotes;
    this.firstVote=firstVote;
    this.latestVote=latestVote;
    this.votes=votes;
  }

}