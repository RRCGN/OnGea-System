import * as React from 'react';

// -------------------------------------------------------------------------------------------------
// ColumnChooser
// -------------------------------------------------------------------------------------------------

export namespace ColumnChooser {
  /** Describes properties passed to a component that renders the column chooser overlay. */
  export interface OverlayProps {
    /** Specifies whether the overlay is visible. */
    visible: boolean;
    /** A React component instance or a DOM element that is used for overlay positioning. */
    target: React.ReactInstance;
    /** An event that initiates overlay hiding. */
    onHide: () => void;
    /** A React node used to render overlay content. */
    children: React.ReactNode;
  }
}

export namespace ColumnChooser {
  /** Describes properties passed to a component that renders the button that invokes the column chooser. */
  export interface ToggleButtonProps {
    /** An event that initiates overlay showing or hiding. */
    onToggle: () => void;
    /** Returns a specified localization message. Available in the "@devexpress/dx-react-grid-material-ui" package. */
    getMessage: (messageKey: string) => string;
    /** A function that accepts the button's root React element. */
    buttonRef: (ref: React.ReactInstance) => void;
  }
}

export namespace ColumnChooser {
  /** Describes properties passed to a component that renders the column chooser container. */
  export interface ContainerProps {
    /** A React node used to render column chooser items. */
    children: React.ReactNode;
  }
}

export namespace ColumnChooser {
  /** Describes properties passed to a component that renders a column chooser item. */
  export interface ItemProps {
    /** A column chooser item. */
    item: ColumnChooserItem;
    /** Specifies whether a column chooser item is disabled. */
    disabled: boolean;
    /** Handles an associated column's visibility changes. */
    onToggle: () => void;
  }
}

/** An object representing a column chooser item. */
export interface ColumnChooserItem {
  /** The grid column associated with the item. */
  column: Column;
  /** Specifies whether the associated column is hidden. */
  hidden: boolean;
}

export namespace ColumnChooser {
  export interface LocalizationMessages {
    /** The toggle button's tooltip text. Available in the "@devexpress/dx-react-grid-material-ui" package. */
    showColumnChooser?: string;
  }
}

export interface ColumnChooserProps {
  /** A component that renders the column chooser overlay. */
  overlayComponent: React.ComponentType<ColumnChooser.OverlayProps>;
  /** A component that renders a button that invokes the column chooser. */
  toggleButtonComponent: React.ComponentType<ColumnChooser.ToggleButtonProps>;
  /** A component that renders the column chooser container. */
  containerComponent: React.ComponentType<ColumnChooser.ContainerProps>;
  /** A component that renders a column chooser item. */
  itemComponent: React.ComponentType<ColumnChooser.ItemProps>;
  /** An object that specifies localization messages. */
  messages?: ColumnChooser.LocalizationMessages;
}

/** The ColumnChooser plugin allows a user to toggle grid columns' visibility at runtime. The column chooser lists columns with checkboxes that control a corresponding column's visibility. */
export declare const ColumnChooser: React.ComponentType<ColumnChooserProps>;

// -------------------------------------------------------------------------------------------------
// CustomGrouping
// -------------------------------------------------------------------------------------------------

export interface CustomGroupingProps {
  /** A function that extracts groups from the specified data. It is executed recursively for the root and nested groups. */
  getChildGroups: (currentRows: Array<any>, grouping: Grouping, rootRows: Array<any>) => Array<{ key: number | string, value?: any, childRows?: Array<any> }>;
  /** Specifies columns by which data is grouped. */
  grouping?: Array<Grouping> | null;
  /** Specifies the expanded groups. */
  expandedGroups?: Array<GroupKey> | null;
}

/** A plugin that converts custom formatted grouped data to a supported format and performs local group expanding/collapsing. */
export declare const CustomGrouping: React.ComponentType<CustomGroupingProps>;

// -------------------------------------------------------------------------------------------------
// CustomPaging
// -------------------------------------------------------------------------------------------------

export interface CustomPagingProps {
  /** The total row count. */
  totalCount?: number;
}

/** A plugin that allows implementing a custom totalCount calculation logic. */
export declare const CustomPaging: React.ComponentType<CustomPagingProps>;

// -------------------------------------------------------------------------------------------------
// CustomTreeData
// -------------------------------------------------------------------------------------------------

export interface CustomTreeDataProps {
  /** A function that extracts child rows from the specified data. It is executed recursively for the root and nested rows. The `currentRow` parameter is `null` for root rows. The return value should be null if a row is a leaf, otherwise, it should be an array of rows. If child rows are not available, the function should return an empty array. */
  getChildRows: (currentRow: any | null, rootRows: Array<any>) => Array<any> | null;
}

/** A plugin that converts custom formatted tree data to a supported format and performs local row expanding/collapsing. */
export declare const CustomTreeData: React.ComponentType<CustomTreeDataProps>;

// -------------------------------------------------------------------------------------------------
// DataTypeProvider
// -------------------------------------------------------------------------------------------------

export namespace DataTypeProvider {
  /** Describes properties passed to a component that renders the formatted value. */
  export interface ValueFormatterProps {
    /** A column object. */
    column: Column;
    /** A row. */
    row?: any;
    /** The value to be formatted. */
    value: any;
  }
}

export namespace DataTypeProvider {
  /** Describes properties passed to a component that renders the value editor. */
  export interface ValueEditorProps {
    /** A column object. */
    column: Column;
    /** A row. */
    row?: any;
    /** Specifies the editor value. */
    value: any;
    /** Handles value changes. */
    onValueChange: (newValue: any) => void;
  }
}

export interface DataTypeProviderProps {
  /** The names of columns associated with the specified formatter and editor. */
  for: Array<string>;
  /** A component that renders the formatted value. */
  formatterComponent?: React.ComponentType<DataTypeProvider.ValueFormatterProps>;
  /** A component that renders a custom editor. */
  editorComponent?: React.ComponentType<DataTypeProvider.ValueEditorProps>;
  /** The names of filter operations available for associated columns. */
  availableFilterOperations?: Array<string>;
}

/** A plugin that provides the capability to customize formatting options and editors depending on the data type. */
export declare const DataTypeProvider: React.ComponentType<DataTypeProviderProps>;

// -------------------------------------------------------------------------------------------------
// DragDropProvider
// -------------------------------------------------------------------------------------------------

export namespace DragDropProvider {
  /** Describes properties of the component that renders a container for columns being dragged. */
  export interface ContainerProps {
    /** The current offset of a column that is being dragged. The offset is measured against the application's client area. */
    clientOffset: { x: number, y: number };
    /** A React node representing columns being dragged. */
    children: React.ReactNode;
  }
}

export namespace DragDropProvider {
  /** Describes properties of the component that renders a column being dragged. */
  export interface ColumnProps {
    /** Specifies a column being dragged. */
    column: Column;
  }
}

export interface DragDropProviderProps {
  /** A component that renders a container for columns being dragged. */
  containerComponent: React.ComponentType<DragDropProvider.ContainerProps>;
  /** A component that renders a column being dragged. */
  columnComponent: React.ComponentType<DragDropProvider.ColumnProps>;
}

/** A plugin that implements the drag-and-drop functionality and visualizes columns that are being dragged. */
export declare const DragDropProvider: React.ComponentType<DragDropProviderProps>;

// -------------------------------------------------------------------------------------------------
// EditingState
// -------------------------------------------------------------------------------------------------

export namespace EditingState {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** Specifies whether editing is enabled for a column. */
    editingEnabled?: boolean;
    /** A function that returns a value specifying row changes depending on the columns' editor values for the current row. This function is called each time the editor's value changes. */
    createRowChange?: (row: any, value: any, columnName: string) => any;
  }
}

/** Describes uncommitted changes made to the grid data. */
export interface ChangeSet {
  /** An array of rows to be created. */
  added?: Array<any>;
  /** An associative array that stores changes made to existing data. Each array item specifies changes made to a row. The item's key specifies the associated row's ID. */
  changed?: { [key: string]: any };
  /** An array of IDs representing rows to be deleted. */
  deleted?: Array<number | string>;
}

export interface EditingStateProps {
  /** A function that returns a row change object depending on row editor values. This function is called each time the row editor's value changes. */
  createRowChange?: (row: any, columnName: string, value: string | number) => any;
  /** Specifies whether editing is enabled for all columns. */
  columnEditingEnabled?: boolean;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<EditingState.ColumnExtension>;
  /** IDs of the rows being edited. */
  editingRowIds?: Array<number | string>;
  /** IDs of the rows initially added to the `editingRowIds` array in uncontrolled mode. */
  defaultEditingRowIds?: Array<number | string>;
  /** Handles adding or removing a row to/from the `editingRowIds` array. */
  onEditingRowIdsChange?: (editingRowIds: Array<number | string>) => void;
  /** Created but not committed rows. */
  addedRows?: Array<any>;
  /** Rows initially added to the `addedRows` array in uncontrolled mode. */
  defaultAddedRows?: Array<any>;
  /** Handles adding or removing a row to/from the `addedRows` array. */
  onAddedRowsChange?: (addedRows: Array<any>) => void;
  /** Not committed row changes. */
  rowChanges?: { [key: string]: any };
  /** Row changes initially added to the `rowChanges` array in uncontrolled mode. */
  defaultRowChanges?: { [key: string]: any };
  /** Handles adding or removing a row changes to/from the `rowChanges` array. */
  onRowChangesChange?: (rowChanges: { [key: string]: any }) => void;
  /** IDs of the rows prepared for deletion. */
  deletedRowIds?: Array<number | string>;
  /** Rows initially added to the `deletedRowIds` array in uncontrolled mode. */
  defaultDeletedRowIds?: Array<number | string>;
  /** Handles adding a row to or removing from the `deletedRowIds` array. */
  onDeletedRowIdsChange?: (deletedRowIds: Array<number | string>) => void;
  /** Handles row changes committing. */
  onCommitChanges: (changes: Array<ChangeSet>) => void;
}

/** A plugin that manages grid rows' editing state. It arranges grid rows by different lists depending on a row's state. */
export declare const EditingState: React.ComponentType<EditingStateProps>;

// -------------------------------------------------------------------------------------------------
// FilteringState
// -------------------------------------------------------------------------------------------------

/** Describes a filter. */
export interface Filter {
  /** Specifies the name of a column whose value is used for filtering. */
  columnName: string;
  /** Specifies the filter value. */
  value?: string;
}

export namespace FilteringState {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** Specifies whether filtering is enabled for a column. */
    filteringEnabled: boolean;
  }
}

export interface FilteringStateProps {
  /** Specifies the applied filters. */
  filters?: Array<Filter>;
  /** Specifies the filters initially applied in the uncontrolled mode. */
  defaultFilters?: Array<Filter>;
  /** Handles filter changes. */
  onFiltersChange?: (filters: Array<Filter>) => void;
  /** Specifies whether filtering is enabled for all columns. */
  columnFilteringEnabled?: boolean;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<FilteringState.ColumnExtension>;
}

/** A plugin that manages the filtering state. */
export declare const FilteringState: React.ComponentType<FilteringStateProps>;

// -------------------------------------------------------------------------------------------------
// Grid
// -------------------------------------------------------------------------------------------------

/** Defines the column configuration object. Used to display data stored in a row. */
export interface Column {
  /** Specifies the column name or the name of a row field whose value the column displays. If the column name does not match any field name, specify the `getCellValue` function. */
  name: string;
  /** Specifies the column title. */
  title?: string;
  /** Specifies the function used to get the column value for a given row. */
  getCellValue?: (row: any, columnName: string) => any;
}

export namespace Grid {
  /** Describes properties passed to a component that renders the grid root layout. */
  export interface RootProps {
    /** A React node to be placed in the root layout. */
    children?: React.ReactNode;
  }
}

export interface GridProps {
  /** An array containing custom data. A user defines the access to this data. Refer to Data Accessors for details. */
  rows: Array<any>;
  /** Specifies for which row fields columns are created. */
  columns: Array<Column>;
  /** Specifies the function used to get a unique row identifier. */
  getRowId?: (row: any) => number | string;
  /** Specifies the function used to get a cell's value. */
  getCellValue?: (row: any, columnName: string) => any;
  /** A component that renders the grid root layout. */
  rootComponent: React.ComponentType<Grid.RootProps>;
}

/** The Grid is a root container component designed to process and display data specified via the `rows` property. You can configure columns using the `columns` property. The Grid's functionality  is implemented in several plugins specified as child components. See the plugins concept for details. */
export declare const Grid: React.ComponentType<GridProps>;

// -------------------------------------------------------------------------------------------------
// GroupingPanel
// -------------------------------------------------------------------------------------------------

/** Describes the grouping panel item properties. */
export interface GroupingPanelItem {
  /** A column associated with the item. */
  column: Column;
  /** The item preview mode. Contains the "add", "remove" or "reorder" value. */
  draft?: string;
}

export namespace GroupingPanel {
  /** Describes properties passed to a component that renders a group panel container. */
  export interface ContainerProps {
    /** A React node to be placed in the root layout. */
    children?: React.ReactNode;
  }
}

export namespace GroupingPanel {
  /** Describes properties passed to a group panel item template when it is being rendered. */
  export interface ItemProps {
    /** The Grouping Panel item. */
    item: GroupingPanelItem;
    /** Specifies whether to display a button that cancels grouping by column. */
    showGroupingControls: boolean;
    /** Specifies whether to render controls that toggle the column's sorting state. */
    showSortingControls: boolean;
    /** Specifies whether grouping by a column is enabled. */
    groupingEnabled: boolean;
    /** Specifies whether sorting by a column is enabled. */
    sortingEnabled: boolean;
    /** Specifies the sorting direction. */
    sortingDirection?: 'asc' | 'desc';
    /** An event that initiates changing the column sorting direction. Cancels sorting by the current column if `direction` is set to null. */
    onSort: (parameters: { direction?: 'asc' | 'desc' | null }) => void;
    /** An event that initiates grouping by column. */
    onGroup: () => void;
  }
}

export namespace GroupingPanel {
  /** Describes properties passed to a component that renders an empty group panel message. */
  export interface EmptyMessageProps {
    /** Returns the text displayed in the group panel if grid data is not grouped. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace GroupingPanel {
  export interface LocalizationMessages {
    /** The text displayed in the group panel if the grid is not grouped. */
    groupByColumn?: string;
  }
}

export interface GroupingPanelProps {
  /** Specifies whether to render controls that toggle the column's sorting state. Requires the SortingState dependency. */
  showSortingControls?: boolean;
  /** Specifies whether column headers display a button that cancels grouping by that column. */
  showGroupingControls?: boolean;
  /** A component that renders a group panel container. */
  containerComponent: React.ComponentType<GroupingPanel.ContainerProps>;
  /** A component that renders a group panel item. */
  itemComponent: React.ComponentType<GroupingPanel.ItemProps>;
  /** A component that renders an empty group panel message. */
  emptyMessageComponent: React.ComponentType<GroupingPanel.EmptyMessageProps>;
  /** An object that specifies the localization messages. */
  messages?: GroupingPanel.LocalizationMessages;
}

/** A plugin that renders the Grouping Panel in the Grid's header. This panel displays grouped columns and allows a user to modify grouping options.Optionally, the plugin allows an end-user to change grouped columns' sorting order and render sorting indicators. */
export declare const GroupingPanel: React.ComponentType<GroupingPanelProps>;

// -------------------------------------------------------------------------------------------------
// GroupingState
// -------------------------------------------------------------------------------------------------

/** Describes grouping options. */
export interface Grouping {
  /** Specifies the name of the column by which the data is grouped. */
  columnName: string;
}

export type GroupKey = string;

export namespace GroupingState {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** Specifies whether grouping is enabled for a column. */
    groupingEnabled: boolean;
  }
}

export interface GroupingStateProps {
  /** Specifies columns to group by. */
  grouping?: Array<Grouping>;
  /** Specifies initial grouping options in the uncontrolled mode. */
  defaultGrouping?: Array<Grouping>;
  /** Handles grouping option changes. */
  onGroupingChange?: (grouping: Array<Grouping>) => void;
  /** Specifies expanded groups. */
  expandedGroups?: Array<GroupKey>;
  /** Specifies initially expanded groups in the uncontrolled mode. */
  defaultExpandedGroups?: Array<GroupKey>;
  /** Specifies whether grouping is enabled for all columns. */
  columnGroupingEnabled?: boolean;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<GroupingState.ColumnExtension>;
  /** Handles expanded group changes. */
  onExpandedGroupsChange?: (expandedGroups: Array<GroupKey>) => void;
}

/** A plugin that manages the grouping state. It lists columns used for grouping and stores information about expanded/collapsed groups. */
export declare const GroupingState: React.ComponentType<GroupingStateProps>;

// -------------------------------------------------------------------------------------------------
// IntegratedFiltering
// -------------------------------------------------------------------------------------------------

export namespace IntegratedFiltering {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** A filter predicate. The `filter` parameter accepts an object containing the 'value' field. Note that you can use the onFilter event to extend this object to the fields your filtering algorithm requires. */
    predicate?: (value: any, filter: Filter, row: any) => boolean;
  }
}

/** Describes data filtering expressions */
export interface FilterExpression {
  /** Specifies the Boolean operator */
  operator: 'and' | 'or';
  /** Specifies filters or filter expressions */
  filters: Array<FilterExpression | Filter>;
}

export interface IntegratedFilteringProps {
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<IntegratedFiltering.ColumnExtension>;
}

/** A plugin that performs built-in data filtering. */
export declare const IntegratedFiltering: React.ComponentType<IntegratedFilteringProps> & {
  /** The built-in filter predicate. The `filter` parameter accepts an object containing the 'value' field. */
  defaultPredicate: (value: any, filter: Filter, row: any) => boolean;
};

// -------------------------------------------------------------------------------------------------
// IntegratedGrouping
// -------------------------------------------------------------------------------------------------

export namespace IntegratedGrouping {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** A grouping criterion function. It returns an object with the **key** field by which data is grouped. If you need to group data by a non-primitive value (for example, a date), assign its string representation to the **key** field and the value to the **value** field. */
    criteria?: (value: any) => { key: string | number, value?: any };
  }
}

export interface IntegratedGroupingProps {
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<IntegratedGrouping.ColumnExtension>;
}

/** A plugin that performs built-in grouping and group expanding/collapsing. */
export declare const IntegratedGrouping: React.ComponentType<IntegratedGroupingProps>;

// -------------------------------------------------------------------------------------------------
// IntegratedPaging
// -------------------------------------------------------------------------------------------------

export interface IntegratedPagingProps {
}

/** A plugin that performs built-in data paging. It also changes the current page if the provided one cannot be applied due to fewer available pages. */
export declare const IntegratedPaging: React.ComponentType<IntegratedPagingProps>;

// -------------------------------------------------------------------------------------------------
// IntegratedSelection
// -------------------------------------------------------------------------------------------------

export interface IntegratedSelectionProps {
}

/** A plugin that performs built-in selection. */
export declare const IntegratedSelection: React.ComponentType<IntegratedSelectionProps>;

// -------------------------------------------------------------------------------------------------
// IntegratedSorting
// -------------------------------------------------------------------------------------------------

export namespace IntegratedSorting {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** A sort compare function. See the Sorting guide for more information. */
    compare?: (a: any, b: any) => number;
  }
}

export interface IntegratedSortingProps {
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<IntegratedSorting.ColumnExtension>;
}

/** A plugin that performs built-in data sorting. */
export declare const IntegratedSorting: React.ComponentType<IntegratedSortingProps>;

// -------------------------------------------------------------------------------------------------
// PagingPanel
// -------------------------------------------------------------------------------------------------

export namespace PagingPanel {
  /** Describes the container component properties. */
  export interface ContainerProps {
    /** Specifies the total page count. */
    totalPages: number;
    /** Specifies the current page. */
    currentPage: number;
    /** Handles the current page changes. */
    onCurrentPageChange: (page: number) => void;
    /** Specifies the page size. */
    pageSize: number;
    /** Handles the page size changes. */
    onPageSizeChange: (size: number) => void;
    /** Specifies the page sizes that a user can select. */
    pageSizes: Array<number>;
    /** Returns the paging panel's text. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace PagingPanel {
  export interface LocalizationMessages {
    /** Specifies the page size selector's 'All' item text. */
    showAll?: string;
    /** Specifies the 'Rows per page' label's text. Available in the "@devexpress/dx-react-grid-material-ui" package. */
    rowsPerPage?: string;
    /** Specifies the 'Row count' text template. */
    info?: (parameters: { from: number, to: number, count: number }) => string | string;
  }
}

export interface PagingPanelProps {
  /** A component that renders the paging panel. */
  containerComponent: React.ComponentType<PagingPanel.ContainerProps>;
  /** The page sizes that a user can select. */
  pageSizes?: Array<number>;
  /** An object that specifies the localization messages. */
  messages?: PagingPanel.LocalizationMessages;
}

/** A plugin that renders the paging panel used for navigation through data pages. */
export declare const PagingPanel: React.ComponentType<PagingPanelProps>;

// -------------------------------------------------------------------------------------------------
// PagingState
// -------------------------------------------------------------------------------------------------

export interface PagingStateProps {
  /** Specifies the current page number. */
  currentPage?: number;
  /** Specifies the initial page in uncontrolled mode. */
  defaultCurrentPage?: number;
  /** Handles current page changes. */
  onCurrentPageChange?: (currentPage: number) => void;
  /** Specifies the page size. Set this property to `0` to show all rows on a page. */
  pageSize?: number;
  /** Specifies the initial page size in uncontrolled mode. */
  defaultPageSize?: number;
  /** Handles page size changes. */
  onPageSizeChange?: (pageSize: number) => void;
}

/** A plugin that manages the paging state. It controls the total page count depending on the total row count and the specified page size, controls the currently selected page number and changes it in response to the corresponding actions. */
export declare const PagingState: React.ComponentType<PagingStateProps>;

// -------------------------------------------------------------------------------------------------
// RowDetailState
// -------------------------------------------------------------------------------------------------

export interface RowDetailStateProps {
  /** IDs of the rows being expanded. */
  expandedRowIds?: Array<number | string>;
  /** IDs of the rows initially expanded in the uncontrolled mode. */
  defaultExpandedRowIds?: Array<number | string>;
  /** Handles expanded rows changes. */
  onExpandedRowIdsChange?: (expandedRowIds: Array<number | string>) => void;
}

/** A plugin that manages the expanded state for table row details. */
export declare const RowDetailState: React.ComponentType<RowDetailStateProps>;

// -------------------------------------------------------------------------------------------------
// SearchPanel
// -------------------------------------------------------------------------------------------------

export namespace SearchPanel {
  /** Describes properties passed to a component that renders the Search Panel root element. */
  export interface InputProps {
    /** Specifies the search value. */
    value: string;
    /** Handles the search value changes. */
    onValueChange: (value:string) => void;
    /** Returns a specified localization message. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace SearchPanel {
  export interface LocalizationMessages {
    /** The search editor placeholder text. */
    searchPlaceholder?: string;
  }
}

export interface SearchPanelProps {
  /** A component that renders the Search Panel input element. */
  inputComponent: React.ComponentType<SearchPanel.InputProps>;
  /** An object that specifies localization messages. */
  messages?: SearchPanel.LocalizationMessages;
}

/** A plugin that renders the Search Panel. */
export declare const SearchPanel: React.ComponentType<SearchPanelProps>;

// -------------------------------------------------------------------------------------------------
// SearchState
// -------------------------------------------------------------------------------------------------

export interface SearchStateProps {
  /** Specifies the applied search value. */
  value?: string;
  /** Specifies the search value initially applied in the uncontrolled mode. */
  defaultValue?: string;
  /** Handles search value changes. */
  onValueChange?: (value: string) => void;
}

/** A plugin that manages the search state. */
export declare const SearchState: React.ComponentType<SearchStateProps>;

// -------------------------------------------------------------------------------------------------
// SelectionState
// -------------------------------------------------------------------------------------------------

export interface SelectionStateProps {
  /** The selected row's IDs. */
  selection?: Array<number | string>;
  /** The initially selected rows in the uncontrolled mode. */
  defaultSelection?: Array<number | string>;
  /** Handles selection changes. */
  onSelectionChange?: (selection: Array<number | string>) => void;
}

/** A plugin that manages the selection state. */
export declare const SelectionState: React.ComponentType<SelectionStateProps>;

// -------------------------------------------------------------------------------------------------
// SortingState
// -------------------------------------------------------------------------------------------------

/** Describes the sorting applied to a column */
export interface Sorting {
  /** Specifies a column's name to which the sorting is applied. */
  columnName: string;
  /** Specifies a column's sorting order. */
  direction: 'asc' | 'desc';
}

export namespace SortingState {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** Specifies whether sorting is enabled for a column. */
    sortingEnabled: boolean;
  }
}

export interface SortingStateProps {
  /** Specifies the applied sorting. */
  sorting?: Array<Sorting>;
  /** Specifies initial sorting in the uncontrolled mode. */
  defaultSorting?: Array<Sorting>;
  /** Specifies whether sorting is enabled for all columns. */
  columnSortingEnabled?: boolean;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<SortingState.ColumnExtension>;
  /** Handles sorting changes. */
  onSortingChange?: (sorting: Array<Sorting>) => void;
}

/** A plugin that manages the sorting state. It controls the list of columns that participate in sorting. */
export declare const SortingState: React.ComponentType<SortingStateProps>;

// -------------------------------------------------------------------------------------------------
// TableBandHeader
// -------------------------------------------------------------------------------------------------

export namespace TableBandHeader {
  /** Describes properties passed to a component that renders a table band cell. */
  export interface CellProps extends Table.CellProps {
    /** A React node used to render band cell content. */
    children?: React.ReactNode;
  }
}

export namespace TableBandHeader {
  /** Describes properties of column bands that the TableBandHeader plugin renders. */
  export interface ColumnBands {
    /** A column name that is used to identify a column in the bands tree. */
    columnName?: string;
    /** The band's title. Used only for bands and ignored for columns. */
    title?: string;
    /** Nested bands and columns. */
    children?: Array<TableBandHeader.ColumnBands>;
  }
}

export interface TableBandHeaderProps {
  /** A component that renders a band cell. */
  cellComponent: React.ComponentType<TableBandHeader.CellProps>;
  /** A component that renders a band cells' row. */
  rowComponent: React.ComponentType<Table.RowProps>;
  /** Specifies column bands for multi-level table header. */
  columnBands: Array<TableBandHeader.ColumnBands>;
}

/** A plugin that renders the banded cells. */
export declare const TableBandHeader: React.ComponentType<TableBandHeaderProps>;

// -------------------------------------------------------------------------------------------------
// TableColumnReordering
// -------------------------------------------------------------------------------------------------

export interface TableColumnReorderingProps {
  /** The column order. */
  order?: Array<string>;
  /** The initial column order in the uncontrolled mode. */
  defaultOrder?: Array<string>;
  /** Handles changes to the column order. */
  onOrderChange?: (nextOrder: Array<string>) => void;
}

/** A plugin that manages the displayed columns' order. */
export declare const TableColumnReordering: React.ComponentType<TableColumnReorderingProps>;

// -------------------------------------------------------------------------------------------------
// TableColumnResizing
// -------------------------------------------------------------------------------------------------

/** Describes an object that specifies a column width. */
export interface TableColumnWidthInfo {
  /** A column name. */
  columnName: string;
  /** A column width. */
  width: number;
}

export interface TableColumnResizingProps {
  /** Specifies column widths. */
  columnWidths?: Array<TableColumnWidthInfo>;
  /** Specifies a column's minimum width. */
  minColumnWidth?: number;
  /** Specifies initial column widths in uncontrolled mode. */
  defaultColumnWidths?: Array<TableColumnWidthInfo>;
  /** Handles column width changes. */
  onColumnWidthsChange?: (nextColumnWidths: Array<TableColumnWidthInfo>) => void;
}

/** A plugin that manages table column widths. */
export declare const TableColumnResizing: React.ComponentType<TableColumnResizingProps>;

// -------------------------------------------------------------------------------------------------
// TableColumnVisibility
// -------------------------------------------------------------------------------------------------

export namespace TableColumnVisibility {
  /** Describes the empty message component's properties. */
  export interface EmptyMessageProps {
    /** Returns the text displayed when all columns are hidden. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace TableColumnVisibility {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** Specifies whether an end-user can change column visibility. */
    togglingEnabled: boolean;
  }
}

export namespace TableColumnVisibility {
  export interface LocalizationMessages {
    /** Specifies the text that is displayed when the plugin does not contain visible columns. */
    noColumns?: string;
  }
}

export interface TableColumnVisibilityProps {
  /** Hidden column names. */
  hiddenColumnNames?: Array<string>;
  /** Names of initially hidden columns in the uncontrolled mode. */
  defaultHiddenColumnNames?: Array<string>;
  /** Specifies whether an end-user can change column visibility. */
  columnTogglingEnabled?: boolean;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<TableColumnVisibility.ColumnExtension>;
  /** Handles hidden columns adding or removing. */
  onHiddenColumnNamesChange?: (hiddenColumnNames: Array<string>) => void;
  /** A component that renders a message that is displayed when all columns are hidden. */
  emptyMessageComponent: React.ComponentType<TableColumnVisibility.EmptyMessageProps>;
  /** An object that specifies localization messages. */
  messages?: TableColumnVisibility.LocalizationMessages;
}

/** A plugin that manages Grid columns' visibility. */
export declare const TableColumnVisibility: React.ComponentType<TableColumnVisibilityProps>;

// -------------------------------------------------------------------------------------------------
// TableEditColumn
// -------------------------------------------------------------------------------------------------

export namespace TableEditColumn {
  /** Describes properties passed to a data row's command cell component. */
  export interface CellProps extends Table.CellProps {
    /** Specifies an edited table row with the applied changes. */
    row: any;
    /** A React node to be placed in the command cell. */
    children?: React.ReactNode;
  }
}

export namespace TableEditColumn {
  /** Describes properties passed to a component that renders a command cell within the header row. */
  export interface HeaderCellProps extends Table.CellProps {
    /** A React node to be placed in the command cell. */
    children?: React.ReactNode;
  }
}

export namespace TableEditColumn {
  /** Describes properties passed to a component that renders command control within a command cell. */
  export interface CommandProps {
    /** The command identifier. */
    id: 'add' | 'edit' | 'delete' | 'commit' | 'cancel';
    /** The command action description. */
    text: string;
    /** An event initiating the command execution. */
    onExecute: () => void;
  }
}

export namespace TableEditColumn {
  export interface LocalizationMessages {
    /** Specifies the add command button text. */
    addCommand?: string;
    /** Specifies the edit command button text. */
    editCommand?: string;
    /** Specifies the delete command button text. */
    deleteCommand?: string;
    /** Specifies the commit command button text. */
    commitCommand?: string;
    /** Specifies the cancel command button text. */
    cancelCommand?: string;
  }
}

export interface TableEditColumnProps {
  /** A component that renders a command cell within a data row. */
  cellComponent: React.ComponentType<TableEditColumn.CellProps>;
  /** A component that renders a command cell within the header row. */
  headerCellComponent: React.ComponentType<TableEditColumn.HeaderCellProps>;
  /** A component that renders command control within a command cell. */
  commandComponent: React.ComponentType<TableEditColumn.CommandProps>;
  /** Specifies whether to render the 'New' command within the header row's command cell. */
  showAddCommand?: boolean;
  /** Specifies whether to render the 'Edit' command within the data row's command cell. */
  showEditCommand?: boolean;
  /** Specifies whether to render the 'Delete' command within the data row's command cell. */
  showDeleteCommand?: boolean;
  /** Specifies the command column's width. */
  width?: number | string;
  /** An object that specifies the localization messages. */
  messages?: TableEditColumn.LocalizationMessages;
}

/** A plugin that renders a command column. This column contains controls used for row editing, creating, or deleting and committing/canceling changes. */
export declare const TableEditColumn: React.ComponentType<TableEditColumnProps>;

// -------------------------------------------------------------------------------------------------
// TableEditRow
// -------------------------------------------------------------------------------------------------

export namespace TableEditRow {
  /** Describes properties passed to a component that renders an editable cell. */
  export interface CellProps extends Table.CellProps {
    /** A row to be edited. */
    row: any;
    /** A column. */
    column: Column;
    /** A value to be edited. */
    value: any;
    /** Specifies whether editing a column is enabled. */
    editingEnabled: boolean;
    /** Handles value changes. */
    onValueChange: (newValue: any) => void;
  }
}

export namespace TableEditRow {
  /** Describes properties passed to a component that renders an editable row. */
  export interface RowProps extends Table.RowProps {
    /** A row to be edited. */
    row: any;
  }
}

export interface TableEditRowProps {
  /** A component that renders an editable cell. */
  cellComponent: React.ComponentType<TableEditRow.CellProps>;
  /** A component that renders an editable row. */
  rowComponent: React.ComponentType<TableEditRow.RowProps>;
  /** Specifies the editable row's height. */
  rowHeight?: number;
}

/** A plugin that renders a row being edited. */
export declare const TableEditRow: React.ComponentType<TableEditRowProps>;

// -------------------------------------------------------------------------------------------------
// TableFilterRow
// -------------------------------------------------------------------------------------------------

export namespace TableFilterRow {
  /** Describes properties passed to a component that renders a filter cell. */
  export interface CellProps extends Table.CellProps {
    /** Filtering options that are applied to a column. */
    filter: Filter | null;
    /** An event that initiates applying a new filter to a column. */
    onFilter: (filter: Filter | null) => void;
    /** A column. */
    column: Column;
    /** Specifies whether filtering by column is enabled. */
    filteringEnabled: boolean;
    /** Returns the filter editor placeholder text. Available in the "@devexpress/dx-react-grid-material-ui" package. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace TableFilterRow {
  /** Describes properties passed to a component that renders a filter selector. */
  export interface FilterSelectorProps {
    /** A component that renders filter selector icons. */
    iconComponent: React.ComponentType<TableFilterRow.IconProps>;
    /** The currently selected filter operation. */
    value: string;
    /** The list of available filter operations. */
    availableValues: Array<string>;
    /** Handles filter operation changes. */
    onChange: (value: string) => void;
    /** Specifies whether the FilterSelector is disabled. */
    disabled: boolean;
    /** Returns the specified localization message. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace TableFilterRow {
  /** Describes properties passed to a component that renders a filter selector icon. */
  export interface IconProps {
    /** Specifies the icon type. */
    type: string;
  }
}

export namespace TableFilterRow {
  /** Describes properties passed to a component that renders a filter editor. */
  export interface EditorProps {
    /** The current editor value. */
    value: any;
    /** Specifies whether the editor is disabled. */
    disabled: boolean;
    /** Handles filter value changes. */
    onChange: (value: string) => void;
    /** Returns the specified localization message. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace TableFilterRow {
  export interface LocalizationMessages {
    /** The filter editor placeholder text. */
    filterPlaceholder?: string;
    /** The 'contains' filter operation name. */
    contains?: string;
    /** The 'notContains' filter operation name. */
    notContains?: string;
    /** The 'startsWith' filter operation name. */
    startsWith?: string;
    /** The 'endsWith' filter operation name. */
    endsWith?: string;
    /** The 'equal' filter operation name. */
    equal?: string;
    /** The 'notEqual' filter operation name. */
    notEqual?: string;
    /** The 'greaterThan' filter operation name. */
    greaterThan?: string;
    /** The 'greaterThanOrEqual' filter operation name. */
    greaterThanOrEqual?: string;
    /** The 'lessThan' filter operation name. */
    lessThan?: string;
    /** The 'lessThanOrEqual' filter operation name. */
    lessThanOrEqual?: string;
  }
}

export interface TableFilterRowProps {
  /** A component that renders a filter cell. */
  cellComponent: React.ComponentType<TableFilterRow.CellProps>;
  /** A component that renders a filter row. */
  rowComponent: React.ComponentType<Table.RowProps>;
  /** A component that renders a filter selector. */
  filterSelectorComponent: React.ComponentType<TableFilterRow.FilterSelectorProps>;
  /** A component that renders filter selector icons. */
  iconComponent: React.ComponentType<TableFilterRow.IconProps>;
  /** A component that renders a filter editor. */
  editorComponent: React.ComponentType<TableFilterRow.EditorProps>;
  /** Specifies whether the FilterSelector should be displayed. */
  showFilterSelector?: boolean;
  /** The filter row's height. */
  rowHeight?: number;
  /** An object that specifies localization messages. */
  messages?: TableFilterRow.LocalizationMessages;
}

/** A plugin that renders a filter row. */
export declare const TableFilterRow: React.ComponentType<TableFilterRowProps>;

// -------------------------------------------------------------------------------------------------
// TableGroupRow
// -------------------------------------------------------------------------------------------------

export namespace TableGroupRow {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of a column to extend. */
    columnName: string;
    /** Specifies whether the grid displays the column by which data is grouped. */
    showWhenGrouped?: boolean;
  }
}

export namespace TableGroupRow {
  /** Describes properties passed to a component that renders a group cell. */
  export interface CellProps extends Table.CellProps {
    /** The group row. */
    row: GroupRow;
    /** The column associated with the group. */
    column: Column;
    /** Specifies whether the row is expanded. */
    expanded: boolean;
    /** An event that initiates group row expanding or collapsing. */
    onToggle: () => void;
  }
}

export namespace TableGroupRow {
  /** Describes properties passed to a component that renders a group row. */
  export interface RowProps extends Table.RowProps {
    /** The group row. */
    row: GroupRow;
  }
}

export namespace TableGroupRow {
  /** Describes properties passed to a component that renders a group indent cell. */
  export interface IndentCellProps extends Table.CellProps {
    /** The group row. */
    row: GroupRow;
    /** A column associated with the group. */
    column: Column;
  }
}

/** Describes the group row structure. */
export interface GroupRow {
  /** The current group key. */
  key: number | string;
  /** The current group value. */
  value: any;
}

export interface TableGroupRowProps {
  /** A Boolean value that specifies whether the grid's table displays a column by which data is grouped. */
  showColumnsWhenGrouped?: boolean;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<TableGroupRow.ColumnExtension>;
  /** A component that renders a group cell. */
  cellComponent: React.ComponentType<TableGroupRow.CellProps>;
  /** A component that renders a group row. */
  rowComponent: React.ComponentType<TableGroupRow.RowProps>;
  /** A component that renders a group indent cell. */
  indentCellComponent?: React.ComponentType<TableGroupRow.IndentCellProps>;
  /** The group indent column's width. */
  indentColumnWidth: number;
}

/** A plugin that renders group rows and enables them to expand and collapse. */
export declare const TableGroupRow: React.ComponentType<TableGroupRowProps>;

// -------------------------------------------------------------------------------------------------
// TableHeaderRow
// -------------------------------------------------------------------------------------------------

export namespace TableHeaderRow {
  /** Describes properties used to render a table header cell. */
  export interface CellProps extends Table.CellProps {
    /** A column object associated with a header cell. */
    column: Column;
    /** Specifies whether to render controls that toggle the column's sorting state. */
    showSortingControls: boolean;
    /** Specifies whether sorting by a column is enabled. */
    sortingEnabled: boolean;
    /** Specifies the associated column's sorting direction. */
    sortingDirection?: 'asc' | 'desc';
    /** An event that initiates changing the column sorting direction. Keeps the current sorting state if `keepOther` is set to true. Cancels sorting by the current column if `direction` is set to null. */
    onSort: (parameters: { direction?: 'asc' | 'desc' | null, keepOther?: boolean }) => void;
    /** Specifies whether to display a button that groups data by column. */
    showGroupingControls: boolean;
    /** Specifies whether grouping by a column is enabled. */
    groupingEnabled: boolean;
    /** An event that invokes grouping by the associated column. */
    onGroup: () => void;
    /** Specifies whether table column resizing is enabled. */
    resizingEnabled: boolean;
    /** An event that initiates column width changing. The initial column width increases by the `shift` value or decreases if `shift` is negative. */
    onWidthChange: (parameters: { shift: number }) => void;
    /** An event that changes the column width used for preview. The initial column width increases by the `shift` value or decreases if `shift` is less than zero. */
    onWidthDraft: (parameters: { shift: number }) => void;
    /** An event that cancels changes of column width used for preview. */
    onWidthDraftCancel: () => void;
    /** Specifies whether drag-and-drop is enabled. */
    draggingEnabled: boolean;
    /** Returns the text displayed in a sorting control within the header cell. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace TableHeaderRow {
  export interface LocalizationMessages {
    /** Specifies the 'Sort' hint's text. Available in the "@devexpress/dx-react-grid-material-ui" package. */
    sortingHint?: string;
  }
}

export interface TableHeaderRowProps {
  /** A component that renders a header cell. */
  cellComponent: React.ComponentType<TableHeaderRow.CellProps>;
  /** A component that renders a header row. */
  rowComponent: React.ComponentType<Table.RowProps>;
  /** Specifies whether to render controls that toggle the column's sorting state. Requires the SortingState dependency. */
  showSortingControls?: boolean;
  /** Specifies whether to display a button that groups data by column. Requires the GroupingState dependency. */
  showGroupingControls?: boolean;
  /** An object that specifies localization messages. */
  messages?: TableHeaderRow.LocalizationMessages;
}

/** A plugin that renders the table's header row. The Column's `title` field specifies the column's title in the header row.The plugin also allows you to manage a column's sorting and grouping state and initiate column dragging. */
export declare const TableHeaderRow: React.ComponentType<TableHeaderRowProps>;

// -------------------------------------------------------------------------------------------------
// TableRowDetail
// -------------------------------------------------------------------------------------------------

export namespace TableRowDetail {
  /** Describes properties passed to a component that renders a detail row's content. */
  export interface ContentProps {
    /** A row. */
    row: any;
  }
}

export namespace TableRowDetail {
  /** Describes properties passed to a component that renders a detail cell. */
  export interface CellProps extends Table.CellProps {
    /** A row. */
    row: any;
    /** A detail cell's child React node. */
    children?: React.ReactNode;
  }
}

export namespace TableRowDetail {
  /** Describes properties passed to a component that renders a detail row. */
  export interface RowProps extends Table.RowProps {
    /** A row. */
    row: any;
  }
}

export namespace TableRowDetail {
  /** Describes properties passed to a component that renders a cell containing the expand/collapse control. */
  export interface ToggleCellProps extends Table.CellProps {
    /** A row. */
    row: any;
    /** Specifies whether to expand the detail row. */
    expanded: boolean;
    /** An event that initiates row expanding or collapsing. */
    onToggle: () => void;
  }
}

export interface TableRowDetailProps {
  /** A component that renders the detail row's content within the detail cell. */
  contentComponent?: React.ComponentType<TableRowDetail.ContentProps>;
  /** A component that renders a detail cell. */
  cellComponent: React.ComponentType<TableRowDetail.CellProps>;
  /** A component that renders a detail row. */
  rowComponent: React.ComponentType<TableRowDetail.RowProps>;
  /** A component that renders a cell containing the expand/collapse control. */
  toggleCellComponent: React.ComponentType<TableRowDetail.ToggleCellProps>;
  /** Specifies the width of the column containing expand/collapse controls. */
  toggleColumnWidth: number;
  /** Specifies the detail row height. */
  rowHeight?: number;
}

/** A plugin that renders detail rows. */
export declare const TableRowDetail: React.ComponentType<TableRowDetailProps>;

// -------------------------------------------------------------------------------------------------
// TableSelection
// -------------------------------------------------------------------------------------------------

export namespace TableSelection {
  /** Describes properties passed to a component that renders a cell containing the Select All checkbox. */
  export interface HeaderCellProps extends Table.CellProps {
    /** Indicates if there are no rows that can be selected. */
    disabled: boolean;
    /** Indicates whether all the rows available for selection are selected. */
    allSelected: boolean;
    /** Indicates whether at least one but not all rows available for selection are selected. */
    someSelected: boolean;
    /** Toggles the Select All checkbox state. */
    onToggle: (select?: boolean) => void;
  }
}

export namespace TableSelection {
  /** Describes properties passed to a component that renders a cell containing a selection checkbox. */
  export interface CellProps extends Table.CellProps {
    /** A row. */
    row: any;
    /** Indicates whether a row is selected. */
    selected: boolean;
    /** An event that initiates row selecting or deselecting. */
    onToggle: () => void;
  }
}

export interface TableSelectionProps {
  /** Specifies whether to highlight the selected rows. Note that `Table` plugin's `rowComponent` is ignored in this case. */
  highlightRow?: boolean;
  /** Specifies whether a user can select/deselect a row by clicking it. Note that `Table` plugin's `rowComponent` is ignored in this case. */
  selectByRowClick?: boolean;
  /** Specifies whether to render the Select All checkbox in the header row. */
  showSelectAll?: boolean;
  /** Specifies whether to render the selection column that displays selection checkboxes. */
  showSelectionColumn?: boolean;
  /** A component that renders a selection cell . */
  cellComponent: React.ComponentType<TableSelection.CellProps>;
  /** A component that renders a cell containing the Select All checkbox. */
  headerCellComponent: React.ComponentType<TableSelection.HeaderCellProps>;
  /** The selection column's width. */
  selectionColumnWidth: number;
}

/** A plugin that visualizes table rows' selection state by rendering selection checkboxes and highlighting the selected rows. */
export declare const TableSelection: React.ComponentType<TableSelectionProps>;

// -------------------------------------------------------------------------------------------------
// TableTreeColumn
// -------------------------------------------------------------------------------------------------

export namespace TableTreeColumn {
  /** Describes properties passed to a component that renders a cell within a data row. */
  export interface CellProps extends Table.CellProps {
    /** Specifies a value to be rendered within the cell. */
    value: any;
    /** Specifies the cell's row. */
    row: any;
    /** Specifies the cell's column. */
    column: Column;
    /** A React node to be rendered within the cell. */
    children?: React.ReactNode;
  }
}

export namespace TableTreeColumn {
  /** Describes properties passed to a component that renders a cell's content. */
  export interface ContentProps {
    /** A React node to be rendered within the cell's content. */
    children?: React.ReactNode;
  }
}

export namespace TableTreeColumn {
  /** Describes properties passed to a component that renders an indent used to identify a row level. */
  export interface IndentProps {
    /** Specifies the row level. */
    level: number;
  }
}

export namespace TableTreeColumn {
  /** Describes properties passed to a component that renders a button used to controls a row's expanded state. */
  export interface ExpandButtonProps {
    /** Specifies whether to show the button. */
    visible: boolean;
    /** Specifies whether a row is expanded. */
    expanded: boolean;
    /** An event that initiates row expanding or collapsing. */
    onToggle: () => void;
  }
}

export namespace TableTreeColumn {
  /** Describes properties passed to a component that renders a checkbox used to control selection. */
  export interface CheckboxProps {
    /** Specifies whether a row is unavailable for selection. */
    disabled: boolean;
    /** Specifies whether a row is selected. */
    checked: boolean;
    /** Specifies whether a row's children are partially selected. */
    indeterminate: boolean;
    /** An event that initiates row selecting or deselecting. */
    onChange: () => void;
  }
}

export interface TableTreeColumnProps {
  /** The name of a column that should be represented as a tree. */
  for: string;
  /** A component that renders a cell within a data row. */
  cellComponent: React.ComponentType<TableTreeColumn.CellProps>;
  /** A component that renders a cell's content. */
  contentComponent: React.ComponentType<TableTreeColumn.ContentProps>;
  /** A component that renders an indent used to identify a row level. */
  indentComponent: React.ComponentType<TableTreeColumn.IndentProps>;
  /** A component that renders a button that controls the row's expanded state. */
  expandButtonComponent: React.ComponentType<TableTreeColumn.ExpandButtonProps>;
  /** A component that renders a checkbox used to control selection. */
  checkboxComponent: React.ComponentType<TableTreeColumn.CheckboxProps>;
  /** Specifies whether to render selection controls. Requires the SelectionState dependency. */
  showSelectionControls?: boolean;
  /** Specifies whether to render Select All checkbox. Requires the IntegratedSelection dependency. */
  showSelectAll?: boolean;
}

/** A plugin that renders a table column with toggle button and sorting indicators. */
export declare const TableTreeColumn: React.ComponentType<TableTreeColumnProps>;

// -------------------------------------------------------------------------------------------------
// Table
// -------------------------------------------------------------------------------------------------

export namespace Table {
  /** Describes additional column properties that the plugin can handle. */
  export interface ColumnExtension {
    /** The name of the column to extend. */
    columnName: string;
    /** The table column width in pixels. */
    width?: number;
    /** The table column alignment. */
    align?: 'left' | 'right' | 'center';
    /** Specifies whether word wrap is enabled in a column's cells. */
    wordWrapEnabled?: boolean;
  }
}

/** Describes properties of a table row that the Table plugin renders. */
export interface TableRow {
  /** A unique table row identifier. */
  key: string;
  /** Specifies the table row type. The specified value defines which cell template is used to render the row. */
  type: string;
  /** Specifies the associated row's ID. */
  rowId?: number | string;
  /** Specifies the associated row. */
  row?: any;
  /** Specifies the table row height. */
  height?: number;
}

/** Describes properties of a table column that the Table plugin renders. */
export interface TableColumn {
  /** A unique table column identifier. */
  key: string;
  /** Specifies the table column type. The specified value defines which cell template is used to render the column. */
  type: string;
  /** Specifies the associated user column. */
  column?: Column;
  /** Specifies the table column width. */
  width?: number;
  /** Specifies the table's column alignment. */
  align?: 'left' | 'right' | 'center';
}

export namespace Table {
  /** Describes properties passed to a component that renders a generic table cell. */
  export interface CellProps {
    /** Specifies a table row. */
    tableRow: TableRow;
    /** Specifies a table column. */
    tableColumn: TableColumn;
    /** The count of columns that the root cell element spans. */
    colSpan?: number;
    /** The count of rows that the root cell element spans. */
    rowSpan?: number;
  }
}

export namespace Table {
  /** Describes properties passed to a component that renders a table cell. */
  export interface DataCellProps extends Table.CellProps {
    /** Specifies a value to be rendered within the cell. */
    value: any;
    /** Specifies the cell's row. */
    row: any;
    /** Specifies the cell's column. */
    column: Column;
  }
}

export namespace Table {
  /** Describes properties passed to a component that renders a table cell when the table is empty. */
  export interface NoDataCellProps extends Table.CellProps {
    /** Returns the text displayed in a cell when a table is empty. */
    getMessage: (messageKey: string) => string;
  }
}

export namespace Table {
  /** Describes properties passed to a component that renders a generic table row. */
  export interface RowProps {
    /** A table row. */
    tableRow: TableRow;
    /** A React node used to render a table row. */
    children: React.ReactNode;
  }
}

export namespace Table {
  /** Describes properties passed to a component that renders a table row. */
  export interface DataRowProps extends Table.RowProps {
    /** A row. */
    row: any;
  }
}

export namespace Table {
  export interface LocalizationMessages {
    /** Specifies text shown when the Grid does not contain data. */
    noData?: string;
  }
}

export interface TableProps {
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<Table.ColumnExtension>;
  /** A component that renders a table. */
  tableComponent: React.ComponentType<object>;
  /** A component that renders a table head. */
  headComponent: React.ComponentType<object>;
  /** A component that renders a table body. */
  bodyComponent: React.ComponentType<object>;
  /** A component that renders a table's container. */
  containerComponent: React.ComponentType<object>;
  /** A component that renders a table cell. */
  cellComponent: React.ComponentType<Table.DataCellProps>;
  /** A component that renders a table row. */
  rowComponent: React.ComponentType<Table.DataRowProps>;
  /** A component that renders a table cell when the table is empty. */
  noDataCellComponent: React.ComponentType<Table.NoDataCellProps>;
  /** A component that renders a table row when the table is empty. */
  noDataRowComponent: React.ComponentType<Table.RowProps>;
  /** A component that renders a stub table row if the row type is not recognized. */
  stubRowComponent: React.ComponentType<Table.RowProps>;
  /** A component that renders a stub table cell if the cell value is not provided. */
  stubCellComponent: React.ComponentType<Table.CellProps>;
  /** A component that renders a stub header cell if the cell value is not provided. */
  stubHeaderCellComponent: React.ComponentType<Table.CellProps>;
  /** An object that specifies the localization messages. */
  messages?: Table.LocalizationMessages;
}

/** A plugin that renders Grid data as a table. It contains the Table Row and Table Cell components that can be extended by other plugins and provides ways to customize table rows and columns. */
export declare const Table: React.ComponentType<TableProps>;

// -------------------------------------------------------------------------------------------------
// Toolbar
// -------------------------------------------------------------------------------------------------

export namespace Toolbar {
  /** Describes properties passed to a component that renders the toolbar root element. */
  export interface RootProps {
    /** A React node to be placed in the toolbar. */
    children?: React.ReactNode;
  }
}

export interface ToolbarProps {
  /** A component that renders the toolbar root element. */
  rootComponent: React.ComponentType<Toolbar.RootProps>;
}

/** A plugin that renders the Grid toolbar. */
export declare const Toolbar: React.ComponentType<ToolbarProps>;

// -------------------------------------------------------------------------------------------------
// TreeDataState
// -------------------------------------------------------------------------------------------------

export interface TreeDataStateProps {
  /** IDs of the rows being expanded. */
  expandedRowIds?: Array<number | string>;
  /** IDs of the rows that are initially expanded in the uncontrolled mode. */
  defaultExpandedRowIds?: Array<number | string>;
  /** Handles expanded rows changes. */
  onExpandedRowIdsChange?: (expandedRowIds: Array<number | string>) => void;
}

/** A plugin that manages the expanded state for tree rows. */
export declare const TreeDataState: React.ComponentType<TreeDataStateProps>;

// -------------------------------------------------------------------------------------------------
// VirtualTable
// -------------------------------------------------------------------------------------------------

export interface VirtualTableProps {
  /** The virtual table's height. */
  height: number;
  /** Estimated row height. Specify the average value for a table whose rows have different heights. */
  estimatedRowHeight: number;
  /** Additional column properties that the plugin can handle. */
  columnExtensions?: Array<Table.ColumnExtension>;
  /** A component that renders a table. */
  tableComponent: React.ComponentType<object>;
  /** A component that renders a table head. */
  headComponent: React.ComponentType<object>;
  /** A component that renders a table body. */
  bodyComponent: React.ComponentType<object>;
  /** A component that renders a table's container. */
  containerComponent: React.ComponentType<object>;
  /** A component that renders a table cell. */
  cellComponent: React.ComponentType<Table.DataCellProps>;
  /** A component that renders a table row. */
  rowComponent: React.ComponentType<Table.DataRowProps>;
  /** A component that renders a table cell when the table is empty. */
  noDataCellComponent: React.ComponentType<Table.NoDataCellProps>;
  /** A component that renders a table row when the table is empty. */
  noDataRowComponent: React.ComponentType<Table.RowProps>;
  /** A component that renders a stub table row if the row type is not recognized. */
  stubRowComponent: React.ComponentType<Table.RowProps>;
  /** A component that renders a stub table cell if the cell value is not provided. */
  stubCellComponent: React.ComponentType<Table.CellProps>;
  /** A component that renders a stub header cell if the cell value is not provided. */
  stubHeaderCellComponent: React.ComponentType<Table.CellProps>;
  /** An object that specifies the localization messages. */
  messages?: Table.LocalizationMessages;
}

/** A plugin that renders a scrollable table instead of a static one. It contains the VirtualTable.Row and VirtualTable.Cell components that provide ways to customize virtual table rows and columns and can be extended by other plugins. */
export declare const VirtualTable: React.ComponentType<VirtualTableProps>;
