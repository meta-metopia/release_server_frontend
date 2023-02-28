import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  Autocomplete,
  Chip,
  Container,
  Pagination,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import useReleases from "@/src/hooks/useReleases";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";
import useNames from "@/src/hooks/useNames";
import useVersions from "@/src/hooks/useVersions";

interface PickerProps {
  name: string | null;
  version: string | null;
  setName: (name: string | null) => void;
  setVersion: (version: string | null) => void;
}

const columns: GridColDef[] = [
  {
    field: "id",
    headerName: "Name",
    flex: 2,
    renderCell: (params) => <Typography>{params.row.name}</Typography>,
  },
  {
    field: "version",
    headerName: "Version",
    flex: 1,
  },
  {
    field: "date",
    headerName: "Date",
    flex: 1,
    renderCell: (params) => (
      <Typography>{dayjs(params.row.date).format("YYYY-MM-DD")}</Typography>
    ),
  },
  {
    field: "assets",
    headerName: "Assets",
    minWidth: 300,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={1}>
        {params.row.assets.map((asset: string, index: number) => (
          <Tooltip title={asset}>
            <Chip
              color="primary"
              clickable
              label={<Typography>Asset {index + 1}</Typography>}
              onClick={() => open(asset)}
            />
          </Tooltip>
        ))}
      </Stack>
    ),
  },
];

export default function Home() {
  const [name, setName] = useState<string | null>("");
  const [version, setVersion] = useState<string | null>("");

  return (
    <>
      <Head>
        <title>Release</title>
        <meta name="description" content="Releases" />
      </Head>
      <Container>
        <Stack spacing={1}>
          <Typography variant="h3" fontWeight={"bold"}>
            Releases
          </Typography>
          <Picker
            name={name}
            setName={setName}
            version={version}
            setVersion={setVersion}
          />
          <DataTable
            name={name}
            version={version}
            setName={setName}
            setVersion={setVersion}
          />
        </Stack>
      </Container>
    </>
  );
}

export function Picker({ name, setName, version, setVersion }: PickerProps) {
  const { data: names, isLoading: isNamesLoading } = useNames();
  const { data: versions, isLoading: isVersionsLoading } = useVersions(name);

  return (
    <Stack direction={"row"} spacing={2}>
      <Autocomplete
        disablePortal
        id="package-name"
        options={names ?? []}
        loading={isNamesLoading}
        sx={{ width: 300 }}
        renderInput={(params) => <TextField {...params} label="Package name" />}
        onChange={(event, value) => {
          setName(value);
        }}
      />
      <Autocomplete
        disablePortal
        id="package-version"
        options={versions ?? []}
        loading={isVersionsLoading}
        sx={{ width: 300 }}
        renderInput={(params) => (
          <TextField {...params} label="Package version" />
        )}
        onChange={(event, value) => {
          setVersion(value);
        }}
      />
    </Stack>
  );
}

export function DataTable({ name, version }: PickerProps) {
  const [page, setPage] = useState(1);
  const { isLoading, data } = useReleases({ page, name, version });

  return (
    <Stack spacing={2}>
      <DataGrid
        rows={data?.items ?? []}
        columns={columns}
        autoHeight
        loading={isLoading}
        getRowId={(row) => `${row.name}-${row.version}`}
        pageSize={data?.per ?? 10}
        page={(data?.page ?? 1) - 1}
        paginationMode="server"
        rowCount={data?.total ?? 0}
        pagination={undefined}
        hideFooterPagination={true}
        hideFooter={true}
      />
      <Stack alignItems={"flex-end"}>
        <Pagination
          count={data?.total_pages ?? 0}
          page={data?.page}
          onChange={(e, page) => {
            setPage(page);
          }}
        />
      </Stack>
    </Stack>
  );
}
