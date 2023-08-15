export class Event {
    id: string = ''
    name: string = ''
    description: string = ''
    createdBy: string = ''
    groupId: string = ''
    startTime: string = ''
    duration: number = -1
    invitedUsers: string[] = []
    acceptedUsers: string[] = []
    acceptanceRatio: number = -1
}