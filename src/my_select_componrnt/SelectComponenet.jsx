import React from 'react';
import _ from 'lodash';
import {AutoComplete} from 'antd'
const {Option} = AutoComplete;

const MAX_RESULTS_TO_SHOW = 3

export default class SelectComponenet extends React.Component
{
    constructor(props){
        super(props);

        this.state = {
            options: [],
        }

        this.makeRequestIfNeeded = this.makeRequestIfNeeded.bind(this);
        this.clearUnneededOptions = this.clearUnneededOptions.bind(this)
        this.queryAndUpdateSelection = this.queryAndUpdateSelection.bind(this);
    }

    render() {
        const optionsChildren = this.state.options.map(
            word => (<Option key={word}>{word}</Option>)
        )
        return <AutoComplete onSearch={this.makeRequestIfNeeded}>
            {optionsChildren}
        </AutoComplete>
    }

    makeRequestIfNeeded(newInput) {
        if (newInput.length === 0) {
            return;
        }        
        else if (newInput.length < 3) {
            this.clearUnneededOptions(newInput);
        } else {
            this.queryAndUpdateSelection(newInput)
        }

    }

    queryAndUpdateSelection(newInput) {
        console.debug(`searching for string ${newInput}`);
        fetch(`https://restcountries.eu/rest/v2/name/${newInput}`, {
            "method": "GET"
        })
        .then(response => response.json()).then(json => {
            console.log(`got ${json.length} results before filtering`);
            const options = _.chain(json).slice(0, MAX_RESULTS_TO_SHOW)
                .map(o => o.name).value();
            this.setState({
                options
            })
        })
        .catch(err => {
            console.log(err);
        });
    }
    
    clearUnneededOptions(newInput) {
        const options = this.state.options.filter(
            name => name.toLowerCase().includes(newInput.toLowerCase()))
        this.setState({
            options
        })
    }

}
    