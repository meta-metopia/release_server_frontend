import Head from "next/head";
import Image from "next/image";
import { Inter } from "next/font/google";
import {
  AppBar,
  Autocomplete,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  Pagination,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";
import useReleases from "@/src/hooks/useReleases";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import dayjs from "dayjs";
import { useState } from "react";
import useNames from "@/src/hooks/useNames";
import useVersions from "@/src/hooks/useVersions";
import path from "path";

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
    minWidth: 500,
    renderCell: (params) => (
      <Stack direction={"row"} spacing={1}>
        {params.row.assets.map((asset: string, index: number) => (
          <Tooltip title={asset}>
            <Chip
              color="primary"
              clickable
              label={<Typography>{path.basename(asset)}</Typography>}
              onClick={() => open(asset)}
            />
          </Tooltip>
        ))}
      </Stack>
    ),
  },
];

export default function Home() {
  const [name, setName] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  return (
    <>
      <Head>
        <title>Release</title>
        <meta name="description" content="Releases" />
      </Head>
      <AppBar
        sx={{
          backgroundColor: "rgba(255, 255, 255, 0.8)",
        }}
        elevation={0}
        position="static"
      >
        <Toolbar>
          <Typography color="black" variant="h5">
            Releases
          </Typography>
        </Toolbar>
      </AppBar>
      <Container sx={{}}>
        <Stack spacing={1}>
          <Picker
            name={name}
            setName={setName}
            version={version}
            setVersion={setVersion}
          />
          <Box
            sx={{
              display: {
                xs: "none",
                sm: "none",
                md: "block",
              },
            }}
          >
            <DataTable
              name={name}
              version={version}
              setName={setName}
              setVersion={setVersion}
            />
          </Box>

          <Box
            sx={{
              display: {
                xs: "block",
                sm: "block",
                md: "none",
              },
            }}
          >
            <DetaList
              name={name}
              version={version}
              setName={setName}
              setVersion={setVersion}
            />
          </Box>
        </Stack>
      </Container>
    </>
  );
}

export function Picker({ name, setName, version, setVersion }: PickerProps) {
  const { data: names, isLoading: isNamesLoading } = useNames();
  const { data: versions, isLoading: isVersionsLoading } = useVersions(name);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Autocomplete
          fullWidth
          disablePortal
          id="package-name"
          options={names ?? []}
          loading={isNamesLoading}
          renderInput={(params) => (
            <TextField {...params} label="Package name" />
          )}
          onChange={(event, value) => {
            setName(value);
          }}
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          fullWidth
          disablePortal
          id="package-version"
          options={versions ?? []}
          loading={isVersionsLoading}
          renderInput={(params) => (
            <TextField {...params} label="Package version" />
          )}
          onChange={(event, value) => {
            setVersion(value);
          }}
        />
      </Grid>
    </Grid>
  );
}

export function DetaList({ name, version }: PickerProps) {
  const [page, setPage] = useState(1);
  const { isLoading, data } = useReleases({ page, name, version });

  return (
    <Stack spacing={2}>
      {isLoading && <LinearProgress />}
      {data?.items.map((item) => (
        <Card
          variant="outlined"
          sx={{
            borderRadius: "16px",
            boxShadow:
              "rgba(145, 158, 171, 0.2) 0px 0px 2px 0px, rgba(145, 158, 171, 0.12) 0px 12px 24px -4px",
          }}
        >
          <CardContent>
            <Stack spacing={1}>
              <Typography variant="h6" fontWeight={"bold"}>
                {item.name}
              </Typography>
              <Typography variant="h6" fontWeight={"bold"}>
                {item.version}
              </Typography>
              <Typography variant="h6" fontWeight={"bold"}>
                {dayjs(item.date).format("YYYY-MM-DD")}
              </Typography>
              <Stack direction={"row"} spacing={1}>
                {item.assets.map((asset: string, index: number) => (
                  <Tooltip title={asset}>
                    <Chip
                      color="primary"
                      clickable
                      label={<Typography>{path.basename(asset)}</Typography>}
                      onClick={() => open(asset)}
                    />
                  </Tooltip>
                ))}
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      ))}
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
