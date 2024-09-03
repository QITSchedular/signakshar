import { DataGrid } from 'devextreme-react'
import { Column } from 'devextreme-react/cjs/data-grid'
import React from 'react'

function LogUI() {
  return (
    <DataGrid
    showColumnLines={true}
    showRowLines={true}
    showBorders={true}
    >
        <Column dataField='ID'></Column>
        <Column dataField='MODULE'></Column>
        <Column dataField='VIEW_NAME'></Column>
        <Column dataField='METHOD'></Column>
        <Column dataField='LOG_LEVEL'></Column>
        <Column dataField='LOG_MESSAGE'></Column>
        <Column dataField='JSON_PAYLOAD'></Column>
        <Column dataField='LOGGED_IN_USER'></Column>
    </DataGrid>
  )
}

export default LogUI