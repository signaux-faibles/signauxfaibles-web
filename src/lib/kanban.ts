export interface KanbanConfigData {
    data: KanbanConfig
}

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

export interface KanbanLabel {
    color: string,
    name: string,
}

interface KanbanMember {
    userID: string,
    active: boolean,
}

export interface KanbanUser {
    id: string | null,
    username: string,
    fullname: string,
    active: boolean,
}

interface KanbanLists {
    [index: string]: KanbanList,
}

interface KanbanLabels {
    [index: string]: KanbanLabel,
}

interface KanbanSwimlanes {
    [index: string]: KanbanSwimlane,
}

interface KanbanMembers {
    [index: string]: KanbanMember,
}

interface KanbanBoards {
    [index: string]: KanbanBoard,
}

export interface KanbanBoard {
    title: string,
    slug: string,
    lists: KanbanLists,
    labels: KanbanLabels,
    swimlanes: KanbanSwimlanes,
    members: KanbanMembers
}

interface KanbanDepartements {
    [index: string]: KanbanDepartementElementIDs[]
}

interface KanbanUsers {
    [index: string]: KanbanUser
}

export interface KanbanConfig {
    departements: KanbanDepartements,
    boards: KanbanBoards,
    users: KanbanUsers,
    userID: string,
}

export function listBoards(kanbanConfig: KanbanConfig): string[] {
    return Object.keys(kanbanConfig.boards)
}

export function label(kanbanConfig: KanbanConfig, boardID: string, labelID: string): KanbanLabel | undefined {
    const board: KanbanBoard | undefined = kanbanConfig.boards[boardID]
    return (board)?board.labels[labelID]:undefined
}

