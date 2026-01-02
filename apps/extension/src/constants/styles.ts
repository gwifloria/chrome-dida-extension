/**
 * Ant Design 组件样式常量
 * 用于统一表单组件的外观
 * 注：基础颜色已通过 antdTheme 配置，这里只保留布局和特殊样式
 */

export const FORM_INPUT_STYLE =
  '!bg-[var(--bg-secondary)] !rounded-xl !border-0 !py-2.5 !px-4 !text-sm [&_.ant-input]:!bg-transparent hover:!bg-[var(--bg-secondary)]/80 focus-within:!bg-[var(--bg-secondary)]/80 !shadow-none'

export const FORM_SELECT_STYLE =
  '[&_.ant-select-selector]:!bg-[var(--bg-secondary)] [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-0 [&_.ant-select-selector]:!py-2 [&_.ant-select-selector]:!px-4 [&_.ant-select-selector]:!h-auto [&_.ant-select-selector]:!shadow-none [&_.ant-select-selection-item]:!text-sm'

export const FORM_DATEPICKER_STYLE =
  '!bg-[var(--bg-secondary)] !rounded-xl !border-0 !py-2.5 !px-4 !shadow-none [&_.ant-picker-input>input]:!text-sm'

export const MODAL_STYLE =
  '[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-header]:!border-0 [&_.ant-modal-header]:!pb-0 [&_.ant-modal-body]:!pt-4 [&_.ant-modal-footer]:!border-t [&_.ant-modal-footer]:!border-dashed [&_.ant-modal-footer]:!border-[var(--border)] [&_.ant-modal-footer]:!mt-2 [&_.ant-modal-footer]:!pt-4'

export const MODAL_OK_BUTTON_STYLE =
  '!rounded-lg !px-5 !h-9 !text-sm !font-medium !shadow-none'

export const MODAL_CANCEL_BUTTON_STYLE =
  '!rounded-lg !px-5 !h-9 !text-sm !shadow-none'

export const FORM_LAYOUT_STYLE =
  '[&_.ant-form-item]:!mb-4 [&_.ant-form-item-label>label]:!text-xs [&_.ant-form-item-label>label]:!font-normal [&_.ant-form-item-label]:!pb-1.5'
