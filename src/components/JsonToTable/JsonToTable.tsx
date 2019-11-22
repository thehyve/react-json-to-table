import * as React from "react";

import "./JsonToTable.css";
import { JSONObjectKeys, JSONObjectType } from "./JsonToTableUtils";
import JSONToTableUtils from "./JsonToTableUtils";

export interface IJsonToTableProps {
    id?: string;
    json: any;
    styles?: any;
}

export default class JsonToTable extends React.Component<IJsonToTableProps,
    {}> {
    // constructor
    constructor(props: any, context: any) {
        super(props, context);
    }

    public render() {
        return (
            <div className={'json-to-table'}>
                <table key={`__j2t_root_table`}>
                    <tbody key={`__j2t_root_tbody`}>{this.renderObject(this.props.json, undefined, 0)}</tbody>
                </table>
            </div>
        );
    }

    private renderObject = (obj: any, header: string | undefined, idx: number) => {
        const phrase = [];
        let tmp;
        if (header) {
            phrase.push(this.renderRowHeader(header));
        }

        const objType: JSONObjectType = JSONToTableUtils.getObjectType(obj);

        switch (objType) {
            case JSONObjectType.ObjectWithNonNumericKeys:
                tmp = header ? (
                    <table key={`__j2t_tableObj${idx}`}>
                        <tbody
                            key={`__j2t_bObj${idx}`}
                        >
                        {this.renderRows(obj)}
                        </tbody>
                    </table>
                ) : (
                    this.renderRows(obj)
                );
                break;
            case JSONObjectType.Array:
                tmp = header ? (
                    <table key={`__j2t_tableArr${idx}`}>
                        <tbody key={`__j2t_bArr${idx}`}>
                        {this.parseArray(obj)}
                        </tbody>
                    </table>
                ) : (
                    this.parseArray(obj)
                );
                break;
        }
        phrase.push(tmp);
        const retval = phrase.map(p => p);
        return header ? (
            <tr key={`__j2t_trObj${idx}`}>{this.renderCell({content: retval, colspan: 2})}</tr>
        ) : (
            retval
        );
    };

    private renderCell = (params: {
        content: any;
        colspan?: number;
        isHeader?: boolean;
    }) => {
        const {content, colspan, isHeader} = params;
        const valueDisplay = isHeader ? <strong>{content}</strong> : content;
        return <td colSpan={colspan ? colspan : 0} key={`__j2t_trObj${valueDisplay}`}>{valueDisplay}</td>;
    };

    private renderHeader = (labels: any[]) => {
        return (
            <tr key={`__j2t_trHeader`}>
                {labels.map((v: string) => {
                    return this.renderCell({content: v});
                })}
            </tr>
        );
    };

    private renderValues = (values: string[]) => {
        return (
            <tr key={`__j2t_trArrString`}>
                {values.map(k => {
                    return this.renderCell({content: k});
                })}
            </tr>
        );
    };

    private renderRowValues = (anArray: any[], labels: any[]) => {
        return anArray.map((item, idx) => {
            return (
                <tr key={`__j2t_Arr${idx.toString()}`}>
                    {labels.map(k => {
                        const isValuePrimitive =
                            JSONToTableUtils.getObjectType(item[k]) === JSONObjectType.Primitive;
                        return isValuePrimitive
                            ? this.renderCell({content: item[k]})
                            : this.renderObject(item[k], k, idx);
                    })}
                </tr>
            );
        });
    };

    private parseArray = (anArray: any[]): any => {
        const phrase = [];
        const labels: JSONObjectKeys = JSONToTableUtils.getUniqueObjectKeys(
            anArray
        );
        if (JSONToTableUtils.checkLabelTypes(labels.labels) !== "number") {
            phrase.push(this.renderHeader(labels.labels));
            phrase.push(this.renderRowValues(anArray, labels.labels));
        } else {
            phrase.push(this.renderValues(anArray));
        }
        return phrase;
    };

    private renderRow = (k: string, v: string | number, idx: number) => {
        return (
            <tr key={`__j2t_tr${idx}`}>
                <td key={`__j2t_tdk${idx}`}>
                    <strong>{k}</strong>
                </td>
                <td key={`__j2t_tdv${idx}`}>{v}</td>
            </tr>
        );
    };

    private renderRowHeader = (label: string) => {
        return (
            <div key={`__j2t_rw${label}`}>
                <strong>{label}</strong>
            </div>
        );
    };

    private renderRows = (obj: any, labelKey?: any) => {
        return Object.keys(obj).map((k, idx) => {
            const value = obj[k];
            const isValuePrimitive =
                JSONToTableUtils.getObjectType(value) === JSONObjectType.Primitive;
            // render row when value is primitive otherwise inspect the value and make the key as header
            const retval: any = isValuePrimitive
                ? this.renderRow(k, value, idx)
                : this.renderObject(value, k, idx);

            return retval;
        });
    };
}
