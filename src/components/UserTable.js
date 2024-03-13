import React, { useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { MultiSelect } from 'primereact/multiselect';
import { Tag } from 'primereact/tag';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import { FilterMatchMode } from 'primereact/api';
import { withTranslation } from 'react-i18next';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import useUserActions from '../actions/users';
import usePermissions from '../hooks/usePermissions';
import { formatDate, parseUtcDate } from '../shared/DateUtils';

const userHasRole = (rowData, role) => rowData.roles.find((r) => { return r.id === role.id; }) !== undefined;

const Actions = ({t, rowData, roles}) => {
    const actions = useRef(null);
    const { toggleUserRole, setMembershipPaid } = useUserActions();
    const permissions = usePermissions();

    const menuItems = [
        {
            label: t('users:roles'),
            items: roles.map((role) => ({ 
                label: (userHasRole(rowData, role) ? t('roles:unassign') : t('roles:assign')) + ': ' + t('roles:names:'+role.name),
                command: () => toggleUserRole(rowData.id, role.id, !userHasRole(rowData, role))
            }))
        },
    ];

    if (rowData.membershipStatus === 'unpaid')
    {
        menuItems.push({
            label: t('titles:membership'),
            items: [
                {
                    label: `${t('common:approve')} ${rowData.currentMembership.paymentMethod} ${formatDate(parseUtcDate(rowData.currentMembership.createdAt))}`,
                    command: () => setMembershipPaid(rowData.id),
                    disabled: !permissions['membership:setPaid']
                },
            ]
        })
    }

    return <React.Fragment>
        <Menu model={menuItems} popup ref={actions} id={"actions_"+rowData["id"]} popupAlignment="right" />
        <Button label="..." text severity='secondary' size='small' icon="pi pi-align-right" className="mr-2" onClick={(event) => actions.current.toggle(event)} aria-controls={"actions_"+rowData["id"]} aria-haspopup />
    </React.Fragment>
}

const UserTable = ({ t, users, roles }) => {
    const [filters] = useState({
        name: { value: null, matchMode: FilterMatchMode.CONTAINS },
        email: { value: null, matchMode: FilterMatchMode.CONTAINS },
        gender: { value: null, matchMode: FilterMatchMode.IN },
        ...Object.fromEntries(roles.map((r) => ['role_'+r.id, { value: null, matchMode: FilterMatchMode.EQUALS }])),
        membershipStatus: { value: null, matchMode: FilterMatchMode.IN },
    });
    const membershipStatuses = [
        { value: 'paid', label: t('membership:membershipPaid'), severity: 'success' },
        { value: 'unpaid', label: t('membership:membershipUnpaid'), severity: 'warning' },
        { value: 'none', label: '', severity: undefined },
    ];
    const genders = [
        { value: 'male', label: t('users:male') },
        { value: 'female', label: t('users:female') },
    ];

    const mapUser = (user) => {
        let userRow = {
            ...user,
            ...Object.fromEntries(roles.map((r) => ['role_'+r.id, userHasRole(user, r)])),
            membershipStatus: user.currentMembership?.paidAt ? 'paid'
                : user.currentMembership ? 'unpaid'
                : 'none'
        };
        return userRow;
    }

    const roleBodyTemplate = (role) => (rowData) => rowData["role_"+role.id]
        ? <Tag value={t('roles:names:'+role.name)} />
        : null;

    const roleFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />;
    };

    const membershipItemTemplate = (option) => option.severity
        ? <Tag value={option.label} severity={option.severity} /> : option.label;

    const membershipBodyTemplate = (rowData) => membershipItemTemplate(membershipStatuses.filter((x) => x.value === rowData.membershipStatus)[0]);

    const membershipFilterTemplate = (options) => 
        <MultiSelect
            value={options.value}
            options={membershipStatuses}
            itemTemplate={membershipItemTemplate}
            onChange={(e) => options.filterApplyCallback(e.value)}
            optionLabel="label"
        />;

    const genderFilterTemplate = (options) =>
        <MultiSelect
            value={options.value}
            options={genders}
            onChange={(e) => options.filterApplyCallback(e.value)}
            optionLabel="label"
        />;

    const genderBodyTemplate = (rowData) => rowData.gender ? t('users:'+rowData.gender) : '';

    const birthDateBodyTemplate = (rowData) => rowData.birthDate ? formatDate(new Date(rowData.birthDate)) : '';

    const actionsTemplate = (rowData) => <Actions t={t} rowData={rowData} roles={roles} />;

    const userRows = users.map(mapUser);

    return (
        <DataTable value={userRows} dataKey="id" paginator rows={20} rowsPerPageOptions={[10, 20, 50, 100]} sortField="name" filters={filters} filterDisplay="row">
            <Column field="name" header={t('common:name')} sortable filter></Column>
            <Column field="email" header={t('common:email')} sortable filter></Column>
            <Column field="gender" header={t('users:gender')} sortable filter body={genderBodyTemplate} filterElement={genderFilterTemplate} showFilterMenu={false}></Column>
            <Column field="birthDate" header={t('users:birthDate')} sortable body={birthDateBodyTemplate}></Column>
            {roles.map((role) => <Column field={"role_"+role.id} key={role.id} header={t('roles:names:'+role.name)} dataType="boolean" sortable body={roleBodyTemplate(role)} filter filterElement={roleFilterTemplate}></Column>)}
            <Column field="membershipStatus" header={t('titles:membership')} body={membershipBodyTemplate} sortable filter filterElement={membershipFilterTemplate} showFilterMenu={false}></Column>
            <Column body={actionsTemplate}></Column>
        </DataTable>
    );
}

export default withTranslation()(UserTable);