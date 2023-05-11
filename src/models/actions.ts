import { Iteration } from "./adoApi"

export type OpenCompletedIterationSummaryAction = {
    action: 'OpenCompletedIterationSummary'
    iteration: Iteration
}

export type OpenIterationSummaryAction = {
    action: 'OpenIterationSummary'
    iteration: Iteration
}

export type GenerateIterationSummaryAction = {
    action: 'GenerateIterationSummary'
    iterationId: string
}

export type BGAction =
    | OpenIterationSummaryAction
    | GenerateIterationSummaryAction
    | OpenCompletedIterationSummaryAction

export function isBGAction(item: any): item is BGAction {
    if ((item as BGAction).action) {
        return true;
    }

    return false;
}