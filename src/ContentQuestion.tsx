import React, { useState, useEffect } from 'react';

import { View, Alert, StyleSheet, TextInput, Picker } from 'react-native';

import { Input, Button, Slider, Header, Text, CheckBox } from 'react-native-elements';
import DateTimePicker from '@react-native-community/datetimepicker';
//import { Picker } from '@react-native-community/picker';
import { RadioButton, Text as NativeText, Divider } from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';

interface ComponentInfo {
    onCancel: (e: any) => any;
    uiSchema: any;
    onSubmit: (e: any) => any;
    onUpdate: (e: any) => any;
    schema: any;
    formData: any;
}

//class Register extends React.Component<RegisterProps, RegisterState> {
class ContentQuestion extends React.Component<ComponentInfo, {}> {
    state = {
        formData: {},
        date: new Date(),
        shows: {},
    };

    uploadFiles = async (e: string) => {
        console.log("uploadFiles >>>>> ")
        try {
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                //allowsEditing: true,
                //aspect: [4, 3],
                quality: 1,
            });
            if (!result.cancelled) {
                this.onUpdate(e, result.uri)
            }
            console.log(result);
        } catch (E) {
            console.log(E);
        }
    }
    onUpdateShow = (e: string, i: any) => {
        console.log("[INFO], On onUpdateShow", this.state.shows)
        this.state.shows[e] = i
        console.log("[INFO], after onUpdateShow", this.state.shows)
        this.setState({
            shows: this.state.shows,
        });
        //this.props.onUpdate(this.state.formData)
    }
    onUpdateList = (e: string, i: any, value: boolean) => {
        let initInfo = this.state.formData[e]
        if (typeof initInfo === "undefined") {
            initInfo = [i]
        } else {
            if (!value) {
                initInfo.push(i)
            } else {
                var index = initInfo.indexOf(i);
                if (index >= 0) {
                    initInfo.splice(index, 1);
                }
            }
        }

        this.state.formData[e] = initInfo
        this.setState({
            formData: this.state.formData,
        });
    }
    onUpdate = (e: string, i: any) => {
        console.log("[INFO], On update", this.state.formData)
        this.state.formData[e] = i
        console.log("[INFO], after update", this.state.formData)
        this.setState({
            formData: this.state.formData,
        });
        this.props.onUpdate(this.state.formData)
    }
    getContentType = (e: any, item: string) => {
        console.log("getContentType")
        console.log(e)
        console.log(item)
        console.log(this.props.uiSchema)
        console.log(this.props.uiSchema[item])
        switch (e.type) {
            case "string":
                //Test if Password
                if (this.props.uiSchema[item]) {
                    if (this.props.uiSchema[item]["ui:widget"] === "password") {
                        return "Password"
                    }
                }
                //Test if Date 
                if (e.format === "date") {
                    return "Date"
                }
                if (e.format === "data-url") {
                    return "Download"
                }
                if (typeof e.enum !== "undefined") {
                    if (this.props.uiSchema[item]["ui:widget"] === "select") {
                        return "SelectList"
                    }
                    if (this.props.uiSchema[item]["ui:widget"] === "radioboxes") {
                        return "RadioList"
                    }
                    return "Select"
                }
                return "Text"
            case "number":
                if (this.props.uiSchema[item]) {
                    if (this.props.uiSchema[item]["ui:widget"] === "range") {
                        return "NumberSlider"
                    }
                }
                return "Number"
            case "integer":
                return "NumberSlider"
            case "array":
                return "CheckBox"
            case "":
                return "SelectPicker"

                break;
        }
        return ""
    }
    isMandatory = (e: any) => {
        console.log("IS MANDATORY ??,", e)
        console.log(Object.entries(this.props.schema.required))
        console.log(this.props.schema.required)
        let test = false;
        this.props.schema.required.forEach((key: any, value: any) => {
            if (key === e) {
                test = true
            }
        })
        if (test) {
            return "*"
        }
        return ""
    }
    myElement = (e: any) => {
        //console.log(json);
        let key = this.getContentType(this.props.schema.properties[e], e)
        let label = e + " " + this.isMandatory(e)
        switch (key) {
            case "Text":
                console.log(e)
                return <Input style={styles.container} placeholder={e} labelStyle={{ color: 'gray', fontSize: 20, fontWeight: "bold" }} label={label}
                    //leftIcon={{ type: 'font-awesome', name: 'comment' }}
                    onChangeText={value => this.onUpdate(e, value)} />
            case "Date":
                let dateValue = this.state.formData[e]
                if (typeof dateValue === "undefined") {
                    dateValue = ""
                }
                return <View>
                    <Text style={{ color: 'gray', fontSize: 20, fontWeight: "bold" }}>{label}</Text>

                    <View>
                        <Button onPress={() => this.onUpdateShow(e, true)}
                            type="outline"
                            title={label + ":" + dateValue} />
                    </View>
                    {this.state.shows[e] && (<DateTimePicker
                        testID="dateTimePicker"
                        value={this.state.formData[e] ? this.state.formData[e] : new Date()}
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(event, selectedDate) => { console.log("Onchange ==> " + event); this.onUpdate(e, selectedDate); this.onUpdateShow(e, false) }}
                    />)}
                </View>

            /*<Input placeholder={e} label={label}
                        //leftIcon={{ type: 'font-awesome', name: 'comment' }}
                        onChangeText={value => this.onUpdate(e, value)} />*/
            case "Password":
                return <Input placeholder={e} labelStyle={{ color: 'gray', fontSize: 20, fontWeight: "bold" }} label={label} secureTextEntry={true}
                    //leftIcon={{ type: 'font-awesome', name: 'comment' }}
                    onChangeText={value => this.onUpdate(e, value)} />
            case "Number":
                return <Input placeholder={e} labelStyle={{ color: 'gray', fontSize: 20, fontWeight: "bold" }} label={label}
                    keyboardType="numeric"
                    onChangeText={value => this.onUpdate(e, value)} />
            case "NumberSlider":
                return <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <Text style={{ color: 'gray', fontSize: 20, fontWeight: "bold" }}>{label}</Text>
                    <Slider
                        minimumValue={0}
                        maximumValue={100}
                        step={1}
                        value={this.state.formData[e]}
                        onValueChange={value => this.onUpdate(e, value)}
                    />
                    <Text>Value: {this.state.formData[e]}</Text>
                </View>
            case "CheckBox":
                return <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <Text style={{ color: 'gray', fontSize: 20, fontWeight: "bold" }}>{label}</Text>

                    {this.props.schema.properties[e].items.enum.map(
                        (val, i) => {
                            return <CheckBox key={i}
                                title={val}
                                checked={this.state.shows[e + "" + val]}
                                onPress={() => {
                                    this.onUpdateShow(e + "" + val, !this.state.shows[e + "" + val]);
                                    this.onUpdateList(e, val, !this.state.shows[e + "" + val]);
                                }
                                }
                            />
                        }
                    )}
                </View>
            case "SelectList":
                return <View style={styles.container}>
                    <Text style={{ color: 'gray', fontSize: 20, fontWeight: "bold" }}>{label}</Text>
                    <Picker
                        selectedValue={this.state.formData[e]}
                        style={{ height: 50, width: 300 }}
                        onValueChange={value => this.onUpdate(e, value)}
                    >
                     <Picker.Item key={0} label="" value="" />
                        {this.props.schema.properties[e].enum.map(
                            (val, i) => {
                                return <Picker.Item key={i} label={val} value={val} />
                            }
                        )}
                    </Picker>
                </View>

            case "RadioList":
                return <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <Text style={{ color: 'gray', fontSize: 20, fontWeight: "bold" }}>{label}</Text>
                    <RadioButton.Group onValueChange={value => this.onUpdate(e, value)} value={this.state.formData[e]}>
                        {this.props.schema.properties[e].enum.map(
                            (val, i) => {
                                return <View key={i}  >
                                    <NativeText>{val}</NativeText>
                                    <RadioButton value={val} />
                                </View>
                            }
                        )}
                    </RadioButton.Group>
                </View>
            case "Download":
                return <View style={{ flex: 1, alignItems: 'stretch', justifyContent: 'center' }}>
                    <Text style={{ color: 'gray', fontSize: 20, fontWeight: "bold" }}>{label}</Text>

                    <View>
                        <Button onPress={() => this.uploadFiles(e)} title={label} />
                    </View>

                </View>


            default:
                return <Text>{key} -- {e} : {this.props.schema.properties[e].type}</Text>

                break;
        }
    }
    orderJsonByOrder = (json: any) => {
        console.log("orderJsonByOrder", json)
        console.log("orderJsonByOrder", this.props.uiSchema["ui:order"])
        let newJson = {}
        if (typeof this.props.uiSchema === "undefined"){
            return newJson
        }
        if (typeof json === "undefined"){
            return newJson
        }
        this.props.uiSchema["ui:order"].map(
            (item, e) => {
                newJson[item] = json[item]
            }
        )
        console.log("orderJsonByOrder", newJson)
        return json
    }
    render() {
        let info = <Text>{JSON.stringify(this.state.formData)}</Text>;
        let json = this.props.schema.properties;
        //Order json properties
        json = this.orderJsonByOrder(json)
        return (
            <View style={styles.container}>
                {/*<Text>{JSON.stringify(this.props.schema)}</Text>
                <Text>{JSON.stringify(this.props.uiSchema)}</Text>
                {info}*/}
                {/*Object.keys(json).map((e, i) => {
                    return <View key={i}>{this.myElement(e)}<Divider /></View>
                })*/}
                
                {this.props.uiSchema["ui:order"].map((e, i) => {
                    return <View key={i} style={styles.container}>{this.myElement(e)}<Divider /></View>
                })}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center' ,width: '100%',
    }
  });


export default ContentQuestion;