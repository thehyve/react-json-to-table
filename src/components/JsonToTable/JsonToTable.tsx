import * as React from 'react';

import "./JsonToTable.css";
import { JSONObjectKeys, JSONObjectType } from './JsonToTableUtils';
import JSONToTableUtils from "./JsonToTableUtils";

export interface IJsonToTableProps {
    id?: string;
    json: any;
    styles?: any;
}

export default class JsonToTable extends React.Component<IJsonToTableProps, {}> {
    // constructor
    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <table>
                <tbody>{this.renderObject(this.props.json)} </tbody>
            </table>
        );
    }

    private renderObject = (obj: any, header?: string) => {
        const phrase = [];
        let tmp;
        if (header) {
            phrase.push(this.renderRowHeader(header, 2));
        }

        const objType: JSONObjectType = JSONToTableUtils.getObjectType(obj);

        switch (objType) {
            case JSONObjectType.ObjectWithNonNumericKeys:
                tmp = header ? (
                    <table>
                        <tbody>{this.renderRows(obj)}</tbody>
                    </table>
                ) : (
                    this.renderRows(obj)
                );
                break;
            case JSONObjectType.Array:
                tmp = header ? (
                    <table>
                        <tbody>{this.parseArray(obj)}</tbody>
                    </table>
                ) : (
                    this.parseArray(obj)
                );
                break;
        }
        phrase.push(tmp);
        const retval = phrase.map(p => p);
        return header ? <tr>{this.renderCell(retval, 2)}</tr> : retval;
    };

    private renderCell = (obj: any, colspan?: number | undefined) => {
        return <td colSpan={colspan ? colspan : 0}>{obj}</td>;
    };

    private renderHeader = (labels: any[]) => {
        return (
            <tr>
                {labels.map((v: string) => {
                    return this.renderCell(<strong>{v}</strong>);
                })}
            </tr>
        );
    };

    private renderValues(values: string[]) {
        return (
            <tr>
                {values.map(k => {
                    return this.renderCell(k);
                })}
            </tr>
        );
    }

    private renderRowValues = (anArray: any[], labels: any[]) => {
        return anArray.map(item => {
            return (
                <tr>
                    {labels.map(k => {
                        const isValuePrimitive =
                            JSONToTableUtils.getObjectType(k) === JSONObjectType.Primitive;
                        return isValuePrimitive
                            ? this.renderCell(item[k])
                            : this.renderObject(item[k], k);
                    })}
                </tr>
            );
        });
    };

    private parseArray = (anArray: any[]): any => {
        const phrase = [];
        const labels: JSONObjectKeys = JSONToTableUtils.getUniqueObjectKeys(anArray);
        console.log(labels.labels);
        console.log(JSONToTableUtils.checkLabelTypes(labels.labels));
        if (JSONToTableUtils.checkLabelTypes(labels.labels) !== "number") {
            phrase.push(this.renderHeader(labels.labels));
            phrase.push(this.renderRowValues(anArray, labels.labels));
        } else {
            phrase.push(this.renderValues(anArray));
        }
        return phrase;
    };

    private renderRow(k: string, v: string | number) {
        return (
            <tr>
                <td>
                    <strong>{k}</strong>
                </td>
                <td>{v}</td>
            </tr>
        );
    }

    private renderRowHeader(label: string, colspan: number | undefined) {
        return (
            <div>
                <strong>{label}</strong>
            </div>
        );
    }

    private renderRows = (obj: any, labelKey?: any) => {
        return Object.keys(obj).map(k => {
            const value = obj[k];
            const isValuePrimitive =
                JSONToTableUtils.getObjectType(value) === JSONObjectType.Primitive;
            // render row when value is primitive otherwise inspect the value and make the key as header
            const retval: any = isValuePrimitive
                ? this.renderRow(k, value)
                : this.renderObject(value, k);

            return retval;
        });
    };
}
