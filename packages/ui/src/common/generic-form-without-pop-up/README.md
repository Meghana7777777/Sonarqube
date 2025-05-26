# GenericForm

Description
------------
GenericForm is an antd based Form component which will take Some Props and returns a Form Component. 

Usage
------------

To use this component:

```import this as 
import GenericForm, { InputTypes } from "********/common";
```


Props To give
------------

form Prop
-----------
this is just an antd FormInstance created by using Form.useForm Ref to use this you have to give:

```console
const [formRef] = Form.useForm();
```
formItems Prop
----------------
this will be the heart for this component where we will define different elements in form
For Example If I need two Inputs 

- 1.FirstOne is Input with name a and label a
- 2.SecondOne is Select with two options as string and string1 then we have to prepare below array and have to Pass to Generic Form Component

```console
const FormItems = [
    { name: 'a', label: 'a', fieldType: { type: InputTypes.Input, placeHolder: 'input a' } },
    {
        name: 'b', label: 'b', fieldType: {
            type: InputTypes.Select, placeHolder: 'input B', options: [{
                value: 'string',
                label: 'string',
            }, {
                value: 'string1',
                label: 'string1',
            }]
        }
    }]
```
initialValues Prop
----------------
If there are any Form initial Values are there at the time of Update we have to Pass this it's any object contain above name as keys
```console
const initialValues={
    a:'default Value a',
    b:'default Value b',
}

```

All Together We will have
```console
< GenericForm formItems = {FormItems} formRef = { formRef } initialValues = {initialValues} />
```