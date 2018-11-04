import React, { Component } from 'react'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import MaterialSelect from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';





export default class CountrySelectNative extends Component
{
	static propTypes =
	{
		selectArrowComponent : PropTypes.func.isRequired
	}

	static defaultProps =
	{
		selectArrowComponent : () => <div className="react-phone-number-input__country-select-arrow"/>
	}

	onChange = (event) =>
	{
		const { onChange } = this.props
		const value = event.target.value
		onChange(value === 'ZZ' ? undefined : value)
	}

	render()
	{

		const
		{
			name,
			value,
			options,
			disabled,
			tabIndex,
			className,
			// eslint-disable-next-line
			selectArrowComponent : SelectArrow
		}
		= this.props

		let selectedOption
		for (const option of options) {
			if (!option.divider && option.value === value) {
				selectedOption = option
			}
		}

		return (
			<div className={ classNames(className, 'react-phone-number-input__country--native') }>
				{ selectedOption && React.createElement(selectedOption.icon, ({ value })) }

				<MaterialSelect
					name={ name }
					value={ value || 'ZZ' }
					onChange={ this.onChange }
					disabled={ disabled }
					tabIndex={ tabIndex }
					inputProps={

						{className:"react-phone-number-input__country-select"}
					}

					className="input-select">
					{options.map(({ value, label, divider }) => (
						<MenuItem
							key={ divider ? '|' : value || 'ZZ' }
							value={ divider ? '|' : value || 'ZZ' }
							disabled={ divider ? true : false }
							className={ divider ? 'react-phone-number-input__country-select-divider' : undefined }>
							{ label }
						</MenuItem>
					))}
				</MaterialSelect>

				
				
			</div>
		)
	}
}