import { atom } from 'recoil';
import type { TaskDataType } from '../../../models';

/**
 * 兼容写法，跨模块引用，待修改
 */
import type { ProjectListType } from '../../overview/hooks/use-operate-project';

export const taskDataState = atom<TaskDataType>({
    key: 'projectDataState', // 唯一的 ID，用于区分不同的 Atom
    default: [], // Atom 的默认值
});

export const taskDataLoading = atom<boolean>({
    key: 'taskDataLoading', // 唯一的 ID，用于区分不同的 Atom
    default: false, // Atom 的默认值
});

export const triggerGetDataState = atom<((text?: string) => Promise<void>) | null>({
    key: 'triggerGetDataState', // 唯一的 ID，用于区分不同的 Atom
    default: null, // Atom 的默认值
});

export const deleteDataState = atom<((id: string | string[]) => boolean) | null>({
    key: 'deleteDataState', // 唯一的 ID，用于区分不同的 Atom
    default: null, // Atom 的默认值
});

export const createOrModifiedDataState = atom<((newValue: TaskDataType[number], id: string) => Promise<boolean>) | null>({
    key: 'createOrModifiedDataState', // 唯一的 ID，用于区分不同的 Atom
    default: null, // Atom 的默认值
});

export const getDataState = atom<((text?: string) => Promise<TaskDataType>) | null>({
    key: 'getDatatState', // 唯一的 ID，用于区分不同的 Atom
    default: null, // Atom 的默认值
});

export const projectDetailState = atom<ProjectListType[number] | null>({
    key: 'projectDetailState', // 唯一的 ID，用于区分不同的 Atom
    default: null, // Atom 的默认值
});
