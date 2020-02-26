import React from 'react'
import '../MobileInput/style.scss'
import MobileInput from 'Common/publicCommon/MobileInput'
import { createForm } from 'rc-form';
import Tool from 'Common/utils/Tool'
import './style.scss'


interface Props {
    className?: string,
    form?: any,
    onChange: Function,
    placeholder?: string,
    title?: string,
    defaultValue?: string,
    errTip?: string,
    defaultPhone?:string,
    bottomNoteOnoff?:boolean,
    flagState?:boolean,
}

class BcPhoneInput extends React.Component<Props, any>{
    state = {
        phoneTit: false
    }
    getInitValue() {
        const { setFields } = this.props.form;
        const { defaultValue } = this.props
        setFields({ phone: { value: Tool.Regular.splitPhone(defaultValue || '') } })
    }
    componentDidMount() {
        this.getInitValue()
    }
    render() {
        const { getFieldProps, getFieldError, getFieldValue, setFields, validateFields } = this.props.form;
        const { phoneTit } = this.state
        const { flagState,className, onChange, placeholder = '银行预留手机号', title = '银行预留手机号', errTip = '请输入11位手机号码'} = this.props
        return <div className={'BcPhoneInput' + " " + className}>
            <div className='addNewBank-card-phone'>
                <span className='bank-tit' style={{ display: phoneTit || !!getFieldValue('phone') ? 'block' : "none" }}>{title}</span>
                <div className='addNewBank-card-input'>
                    <span>
                        <MobileInput
                            {...getFieldProps('phone', {
                                rules: [{
                                    transform: (val:string) => Tool.Regular.trimSpace(val),
                                    pattern: Tool.Regular.bcphone, message: errTip
                                }
                                ]
                            })}
                            type="phone"
                            disabled={flagState}
                            placeholder={placeholder}
                            error={!!getFieldError('phone')}
                            onErrorClick={getFieldError('phone')}
                            onChange={(val:string) => {
                                onChange(Tool.Regular.trimSpace(val))
                                setFields({ phone: { value: val } }),
                                validateFields({ phone: { value: val } })
                            }}
                            onFocus={() => { this.setState({ phoneTit: true }) }}
                            onBlur={() => { this.setState({ phoneTit: false }) }}
                            mold='phone'
                        >
                        </MobileInput>
                    </span>
                </div>
            </div>
        </div>
    }
}
export default createForm()(BcPhoneInput)
