import {
  IApproveTaskResponseModel,
  IChildTasksRequestModel,
  ICreateTaskRequestModel,
  ICreateTemplateRequestModel,
  IDefaultResponseModel,
  IDeleteTemplateRequestModel,
  IMyTasksResponseModel,
  IPendingCountResponseModel,
  ISubmitTaskRequestModel,
  ISubmitTaskResponseModel,
  ITaskActionRequestModel,
  ITaskListResponseModel,
  ITaskResponseModel,
  ITaskTemplateResponseModel,
  ITaskTemplatesResponseModel,
  IUpdateTaskRequestModel,
} from 'models';
import { baseApi } from './base';
import { tasksRoutes } from './routes';

export const tasksApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['Tasks', 'TaskTemplates', 'PendingTasks', 'LearningProgress'] })
  .injectEndpoints({
    endpoints: builder => ({
      getMyTasks: builder.query<IMyTasksResponseModel, void>({
        query: () => ({
          url: tasksRoutes().myTasks,
          method: 'GET',
        }),
        providesTags: ['Tasks'],
      }),

      // Отметка «сделал» звёзд не приносит — их начисляет подтверждение
      // родителя, поэтому баланс здесь не инвалидируется.
      submitTask: builder.mutation<ISubmitTaskResponseModel, ISubmitTaskRequestModel>({
        query: ({ taskId }) => ({
          url: tasksRoutes().submitTask(taskId),
          method: 'POST',
        }),
        invalidatesTags: ['Tasks'],
      }),

      getChildTasks: builder.query<ITaskListResponseModel, IChildTasksRequestModel>({
        query: ({ id, status }) => ({
          url: tasksRoutes().childTasks(id),
          method: 'GET',
          params: status ? { status } : undefined,
        }),
        providesTags: ['Tasks'],
      }),

      createChildTask: builder.mutation<ITaskResponseModel, ICreateTaskRequestModel>({
        query: ({ id, ...body }) => ({
          url: tasksRoutes().childTasks(id),
          method: 'POST',
          body,
        }),
        // saveAsTemplate создаёт шаблон побочным эффектом, поэтому их список
        // тоже устаревает.
        invalidatesTags: ['Tasks', 'TaskTemplates'],
      }),

      updateChildTask: builder.mutation<ITaskResponseModel, IUpdateTaskRequestModel>({
        query: ({ id, taskId, ...body }) => ({
          url: tasksRoutes().childTask(id, taskId),
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['Tasks'],
      }),

      deleteChildTask: builder.mutation<IDefaultResponseModel, ITaskActionRequestModel>({
        query: ({ id, taskId }) => ({
          url: tasksRoutes().childTask(id, taskId),
          method: 'DELETE',
        }),
        invalidatesTags: ['Tasks', 'PendingTasks'],
      }),

      // Единственное место, где задача превращается в звёзды, поэтому здесь
      // устаревает и баланс: карточка звёзд в профиле ребёнка читает его же.
      approveChildTask: builder.mutation<IApproveTaskResponseModel, ITaskActionRequestModel>({
        query: ({ id, taskId }) => ({
          url: tasksRoutes().approveTask(id, taskId),
          method: 'POST',
        }),
        invalidatesTags: ['Tasks', 'PendingTasks', 'LearningProgress'],
      }),

      reopenChildTask: builder.mutation<ITaskResponseModel, ITaskActionRequestModel>({
        query: ({ id, taskId }) => ({
          url: tasksRoutes().reopenTask(id, taskId),
          method: 'POST',
        }),
        invalidatesTags: ['Tasks', 'PendingTasks'],
      }),

      getTaskTemplates: builder.query<ITaskTemplatesResponseModel, void>({
        query: () => ({
          url: tasksRoutes().templates,
          method: 'GET',
        }),
        providesTags: ['TaskTemplates'],
      }),

      createTaskTemplate: builder.mutation<ITaskTemplateResponseModel, ICreateTemplateRequestModel>({
        query: body => ({
          url: tasksRoutes().templates,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['TaskTemplates'],
      }),

      deleteTaskTemplate: builder.mutation<IDefaultResponseModel, IDeleteTemplateRequestModel>({
        query: ({ templateId }) => ({
          url: tasksRoutes().template(templateId),
          method: 'DELETE',
        }),
        invalidatesTags: ['TaskTemplates'],
      }),

      // Пушей в приложении нет, и этот счётчик — единственный способ узнать, что
      // ребёнок что-то доделал. Поэтому он живёт отдельным запросом и обновляется
      // при каждом действии с задачами.
      getPendingTasksCount: builder.query<IPendingCountResponseModel, void>({
        query: () => ({
          url: tasksRoutes().pendingCount,
          method: 'GET',
        }),
        providesTags: ['PendingTasks'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetMyTasksQuery,
  useLazyGetMyTasksQuery,
  useSubmitTaskMutation,
  useGetChildTasksQuery,
  useLazyGetChildTasksQuery,
  useCreateChildTaskMutation,
  useUpdateChildTaskMutation,
  useDeleteChildTaskMutation,
  useApproveChildTaskMutation,
  useReopenChildTaskMutation,
  useGetTaskTemplatesQuery,
  useCreateTaskTemplateMutation,
  useDeleteTaskTemplateMutation,
  useGetPendingTasksCountQuery,
} = tasksApi;
