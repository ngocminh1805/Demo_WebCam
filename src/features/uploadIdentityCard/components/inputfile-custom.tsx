import * as React from 'react';
import './inputfile-custom.css'


interface Props{
    label: string
    callback : any
    loadImagae: any
    type: number
}


class InputFileCustom extends React.PureComponent<Props>{

    componentDidMount(){
        console.log('====================================');
        console.log('PROPS :', this.props);
        console.log('====================================');
    }
 
    //@ts-ignore
    onChange = (e) => {
      console.log('====================================');
      console.log('CallBack :' , this.props.callback);
      console.log('====================================');
      this.props.callback(e,this.props.type)
      this.props.loadImagae(e,this.props.type)
    }

    render(){
        const {label} = this.props
        return(
            <label className = "upload_image_button">
            {label}
            <input
              type="file"
              onChange={(e) => this.onChange(e)}
              className="input_file"
              id="upload_front_image"
            />
          </label>
        )
    }
}

export default InputFileCustom