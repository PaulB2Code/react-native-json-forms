import React, { useState, useEffect } from 'react';

import { View ,Platform } from 'react-native';

import { Input, Button, Divider, Header,Text } from 'react-native-elements';
import ContentQuestion from './ContentQuestion';

interface ComponentInfo {
    onCancel: (e: any) => any;
    uiSchema: any;
    onSubmit: (e: any) => any;
    schema: any;
}
export const ReactJsonForm = (props: ComponentInfo) => {
    const [state, setState] = useState({
        formData: {},
    });
    useEffect(() => {
    });
    const onSubmit = () => {
        console.log("[INFO], On Submit")
        props.onSubmit(state.formData)
    }
    const onUpdate= (e:any) => {
        console.log("[INFO], On Update Parents",e)
        setState(state => ({ ...state,  formData: e}))
    }
    return (
        <View>
            {!!(Platform.OS === 'web') ?
                <View >
                    <Text>Works only on android and ios</Text>
                </View>
                :
                <View >
                    <Text h4>{props.schema.title}</Text>
                    {/*Content for the input Values*/}
                    <ContentQuestion {...props} onUpdate={(e) => onUpdate(e)}/>
                    <Button
                        title="Cancel"
                        type="outline"
                        onPress={(e) => props.onCancel(e)}
                    />
                    <Button
                        title="Submit"
                        onPress={() => onSubmit()}
                    />
                </View>
            }
        </View>
    );
}


export default ReactJsonForm;