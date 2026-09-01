export const tasksRoutes = (version: string = 'v1') => {
  return {
    // Ребёнок читает свои задачи здесь: список строится из токена, а не из того,
    // что прислал клиент.
    myTasks: `/${version}/tasks`,
    submitTask: (taskId: string) => `/${version}/tasks/${taskId}/submit`,
    templates: `/${version}/tasks/templates`,
    template: (templateId: string) => `/${version}/tasks/templates/${templateId}`,
    pendingCount: `/${version}/tasks/pending-count`,
    // Родитель управляет задачами внутри ребёнка — рядом с его фильтром.
    childTasks: (childId: string) => `/${version}/children/${childId}/tasks`,
    childTask: (childId: string, taskId: string) =>
      `/${version}/children/${childId}/tasks/${taskId}`,
    approveTask: (childId: string, taskId: string) =>
      `/${version}/children/${childId}/tasks/${taskId}/approve`,
    reopenTask: (childId: string, taskId: string) =>
      `/${version}/children/${childId}/tasks/${taskId}/reopen`,
  };
};
