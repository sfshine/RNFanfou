import React from "react";
import {Portal} from "@ant-design/react-native";

export default class ArchModal {
    private key

    show(reactNode: React.ReactNode) {
        this.remove()
        this.key = Portal.add(reactNode)
    }

    remove() {
        if (this.key) {
            Portal.remove(this.key)
            this.key = undefined
        }
    }
}
