interface KanbanDepartementElementIDs {
    boardID: string,
    swimlaneID: string,
}

interface KanbanSwimlane {
    title: string,
    sort: number,
}
interface KanbanList {
    title: string,
    sort: number,
}

interface KanbanLabel {
    color: string,
    name: string,
}

interface KanbanMember {
    userID: string,
    active: boolean,
}
interface KanbanUser {
    username: string,
    fullname: string,
    active: boolean,
}
interface KanbanBoard {
    title: string,
    slug: string,
    lists: Map<string,KanbanList>
    labels: Map<string, KanbanLabel>
    swimlanes: Map<string, KanbanSwimlane>
    members: Map<string, KanbanMember>
}
export interface KanbanConfig {
    departements: Map<string, KanbanDepartementElementIDs[]>,
    boards: Map<string, KanbanBoard>,
    users: Map<string, KanbanUser>,
    userID: string,
}

export function listBoards(kanbanConfig: KanbanConfig): string[] {
    return Object.keys(kanbanConfig.boards)
}