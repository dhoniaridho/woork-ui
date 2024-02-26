"use client";
import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Pagination,
  Select,
  SelectItem,
  Breadcrumbs,
  BreadcrumbItem,
  Badge,
  Chip,
} from "@nextui-org/react";
import { DateTime } from "@/utils/datetime";
import { useQuery } from "@tanstack/react-query";
import { PaginationType } from "@/types/pagination";
  import { Loader } from "@/components/loader";
import { getUsers } from "../_services/get";

export function UserTable() {
  const [params, setParams] = useState<PaginationType>({
    page: 1,
    pageSize: 10,
  });

  const { data, isLoading } = useQuery({
    queryKey: ["checkins", params],
    queryFn: async () => {
      return getUsers(params);
    },
  });

  const STATUS = {
    AFK: <Chip color="warning">AFK</Chip>,
    IN: <Chip color="success">IN</Chip>,
    LOGOUT: <Chip color="danger">OUT</Chip>,
  };

  return (
    <div>
      <div className="mb-5">
        <h3 className="mb-2">
          <span className="text-3xl font-bold">Checkins</span>
        </h3>
        <Breadcrumbs>
          <BreadcrumbItem>Checkin</BreadcrumbItem>
          <BreadcrumbItem>List</BreadcrumbItem>
        </Breadcrumbs>
      </div>
      <Table aria-label="Example static collection table">
        <TableHeader>
          <TableColumn>Name</TableColumn>
          <TableColumn>Email</TableColumn>
          <TableColumn>Username</TableColumn>
          <TableColumn>Created At</TableColumn>
          <TableColumn>Updated At</TableColumn>
        </TableHeader>
        <TableBody
          items={data?.data.data || []}
          emptyContent={isLoading ? " " : "No data"}
          loadingContent={<Loader isLoading={isLoading}>Loading</Loader>}
          isLoading={isLoading}
        >
          {(item) => (
            <TableRow key={item.id}>
              <TableCell>{item.fullName}</TableCell>
              <TableCell>{item.email}</TableCell>
              <TableCell>{item.username}</TableCell>
              <TableCell>
                <DateTime date={item.createdAt}></DateTime>
              </TableCell>
              <TableCell>
                <DateTime date={item.updatedAt}></DateTime>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="flex justify-between mt-5">
        <div className="w-36">
          <Select
            label="Show"
            selectedKeys={[`${params.pageSize}`]}
            onChange={(e) =>
              setParams({ ...params, pageSize: +e.target.value })
            }
          >
            <SelectItem key="10" value={10}>
              10
            </SelectItem>
            <SelectItem key="20" value={20}>
              20
            </SelectItem>
            <SelectItem key="30" value={30}>
              30
            </SelectItem>
          </Select>
        </div>
        <Pagination
          total={data?.data.meta.totalPage ?? 1}
          initialPage={params.page}
          defaultValue={params.page}
          disableAnimation
          onChange={(page) => setParams({ ...params, page })}
        />
      </div>
    </div>
  );
}
