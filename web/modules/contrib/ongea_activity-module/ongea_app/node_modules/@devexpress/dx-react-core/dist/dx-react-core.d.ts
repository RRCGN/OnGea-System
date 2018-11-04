import * as React from 'react';

// -------------------------------------------------------------------------------------------------
// Action
// -------------------------------------------------------------------------------------------------

export interface ActionProps {
  /** The action name. */
  name: string;
  /** A function that is called when the action is executed. */
  action: (payload?: any) => void;
}

/** A React component that shares a function between other plugins within a plugin-based component. */
export declare const Action: React.ComponentType<ActionProps>;

// -------------------------------------------------------------------------------------------------
// Getter
// -------------------------------------------------------------------------------------------------

export interface GetterProps {
  /** The Getter's name. */
  name: string;
  /** The shared value. */
  value?: any;
  /** A function that calculates a value depending on the values other Getters expose. The value is computed each time a related Getter's value changes. Applies only if `value` is not defined. */
  computed?: (getters: { [getterName: string]: any }) => any;
}

/** A React component that shares a value between other plugins within a plugin-based component. */
export declare const Getter: React.ComponentType<GetterProps>;

// -------------------------------------------------------------------------------------------------
// PluginHost
// -------------------------------------------------------------------------------------------------

export interface PluginHostProps {
  /** Plugin React elements. */
  children: React.ReactNode;
}

/** A React component that implements the plugin interaction mechanism in a plugin-based component. */
export declare const PluginHost: React.ComponentType<PluginHostProps>;

// -------------------------------------------------------------------------------------------------
// Plugin
// -------------------------------------------------------------------------------------------------

export interface PluginProps {
  /** React elements that expose the plugin's state and actions and render the plugin's UI. */
  children: React.ReactNode;
}

/** A plugin component. The plugin's functionality is implemented in child Action, Getter and Template components. */
export declare const Plugin: React.ComponentType<PluginProps>;

// -------------------------------------------------------------------------------------------------
// TemplateConnector
// -------------------------------------------------------------------------------------------------

export interface TemplateConnectorProps {
  /** A function that renders a markup using Getters and Actions passed as arguments. */
  children: (getters: { [getterName: string]: any }, actions: { [actionName: string]: (payload?: any) => void }) => React.ReactNode;
}

/** A React component that provides access to Getters and Actions within a Template. */
export declare const TemplateConnector: React.ComponentType<TemplateConnectorProps>;

// -------------------------------------------------------------------------------------------------
// TemplatePlaceholder
// -------------------------------------------------------------------------------------------------

export interface TemplatePlaceholderProps {
  /** The name of a template to be rendered. */
  name?: string;
  /** An object passed to the related template. */
  params?: object;
}

/** A React component to which a related Template is rendered. */
export declare const TemplatePlaceholder: React.ComponentType<TemplatePlaceholderProps>;

// -------------------------------------------------------------------------------------------------
// Template
// -------------------------------------------------------------------------------------------------

export interface TemplateProps {
  /** The template name. The `root` name is reserved. A template called `root` is rendered as the plugin based component's root. */
  name: string;
  /** A predicate function that returns a Boolean value that specifies whether the template should be rendered. */
  predicate?: (params: object) => boolean;
  /** A markup or function that returns a markup based on the specified parameters. */
  children: React.ReactNode | ((params: object) => React.ReactNode);
}

/** A React component that defines a markup that is rendered as the corresponding TemplatePlaceholder. */
export declare const Template: React.ComponentType<TemplateProps>;
