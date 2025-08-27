"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWorkflowById = void 0;
exports.newWorkflow = newWorkflow;
exports.createWorkflow = createWorkflow;
exports.createManyWorkflows = createManyWorkflows;
exports.shareWorkflowWithUsers = shareWorkflowWithUsers;
exports.shareWorkflowWithProjects = shareWorkflowWithProjects;
exports.getWorkflowSharing = getWorkflowSharing;
exports.createWorkflowWithTrigger = createWorkflowWithTrigger;
exports.getAllWorkflows = getAllWorkflows;
exports.getAllSharedWorkflows = getAllSharedWorkflows;
const db_1 = require("@n8n/db");
const di_1 = require("@n8n/di");
const n8n_workflow_1 = require("n8n-workflow");
const uuid_1 = require("uuid");
function newWorkflow(attributes = {}) {
    const { active, isArchived, name, nodes, connections, versionId, settings } = attributes;
    const workflowEntity = di_1.Container.get(db_1.WorkflowRepository).create({
        active: active ?? false,
        isArchived: isArchived ?? false,
        name: name ?? 'test workflow',
        nodes: nodes ?? [
            {
                id: 'uuid-1234',
                name: 'Schedule Trigger',
                parameters: {},
                position: [-20, 260],
                type: 'n8n-nodes-base.scheduleTrigger',
                typeVersion: 1,
            },
        ],
        connections: connections ?? {},
        versionId: versionId ?? (0, uuid_1.v4)(),
        settings: settings ?? {},
        ...attributes,
    });
    return workflowEntity;
}
async function createWorkflow(attributes = {}, userOrProject) {
    const workflow = await di_1.Container.get(db_1.WorkflowRepository).save(newWorkflow(attributes));
    if (userOrProject instanceof db_1.User) {
        const user = userOrProject;
        const project = await di_1.Container.get(db_1.ProjectRepository).getPersonalProjectForUserOrFail(user.id);
        await di_1.Container.get(db_1.SharedWorkflowRepository).save(di_1.Container.get(db_1.SharedWorkflowRepository).create({
            project,
            workflow,
            role: 'workflow:owner',
        }));
    }
    if (userOrProject instanceof db_1.Project) {
        const project = userOrProject;
        await di_1.Container.get(db_1.SharedWorkflowRepository).save(di_1.Container.get(db_1.SharedWorkflowRepository).create({
            project,
            workflow,
            role: 'workflow:owner',
        }));
    }
    return workflow;
}
async function createManyWorkflows(amount, attributes = {}, user) {
    const workflowRequests = [...Array(amount)].map(async (_) => await createWorkflow(attributes, user));
    return await Promise.all(workflowRequests);
}
async function shareWorkflowWithUsers(workflow, users) {
    const sharedWorkflows = await Promise.all(users.map(async (user) => {
        const project = await di_1.Container.get(db_1.ProjectRepository).getPersonalProjectForUserOrFail(user.id);
        return {
            projectId: project.id,
            workflowId: workflow.id,
            role: 'workflow:editor',
        };
    }));
    return await di_1.Container.get(db_1.SharedWorkflowRepository).save(sharedWorkflows);
}
async function shareWorkflowWithProjects(workflow, projectsWithRole) {
    const newSharedWorkflow = await Promise.all(projectsWithRole.map(async ({ project, role }) => {
        return di_1.Container.get(db_1.SharedWorkflowRepository).create({
            workflowId: workflow.id,
            role: role ?? 'workflow:editor',
            projectId: project.id,
        });
    }));
    return await di_1.Container.get(db_1.SharedWorkflowRepository).save(newSharedWorkflow);
}
async function getWorkflowSharing(workflow) {
    return await di_1.Container.get(db_1.SharedWorkflowRepository).find({
        where: { workflowId: workflow.id },
        relations: { project: true },
    });
}
async function createWorkflowWithTrigger(attributes = {}, user) {
    const workflow = await createWorkflow({
        nodes: [
            {
                id: 'uuid-1',
                parameters: {},
                name: 'Start',
                type: 'n8n-nodes-base.start',
                typeVersion: 1,
                position: [240, 300],
            },
            {
                id: 'uuid-2',
                parameters: { triggerTimes: { item: [{ mode: 'everyMinute' }] } },
                name: 'Cron',
                type: 'n8n-nodes-base.cron',
                typeVersion: 1,
                position: [500, 300],
            },
            {
                id: 'uuid-3',
                parameters: { options: {} },
                name: 'Set',
                type: 'n8n-nodes-base.set',
                typeVersion: 1,
                position: [780, 300],
            },
        ],
        connections: {
            Cron: { main: [[{ node: 'Set', type: n8n_workflow_1.NodeConnectionTypes.Main, index: 0 }]] },
        },
        ...attributes,
    }, user);
    return workflow;
}
async function getAllWorkflows() {
    return await di_1.Container.get(db_1.WorkflowRepository).find();
}
async function getAllSharedWorkflows() {
    return await di_1.Container.get(db_1.SharedWorkflowRepository).find();
}
const getWorkflowById = async (id) => await di_1.Container.get(db_1.WorkflowRepository).findOneBy({ id });
exports.getWorkflowById = getWorkflowById;
//# sourceMappingURL=workflows.js.map