import { Box, Flex, Icon, Breadcrumb, Link, Text } from "brainly-style-guide";

import type { ReportDataInModerationTicket } from "@typings/";

import DateTime from "../common/DateTime";

export default function ReportSection(props: {
  report: ReportDataInModerationTicket
}) {
  const report = props.report;
  const reporter = props.report.user;

  return (
    <Box border className="moderation-ticket-report" padding="xs">
      <Flex>
        <Icon type="report_flag" color="icon-red-50" size={32} />
        <Flex direction="column">
          <Breadcrumb elements={[
            <Link size="small" target="_blank" href={reporter.profileLink}>
              {reporter.nick}
            </Link>
          ]} />
          <Text weight="bold" size="small">{report.abuseName}</Text>
          {!!report.abuseDetails && 
            <Text size="small" color="text-gray-70">{report.abuseDetails}</Text>
          }
        </Flex>
        <Text size="xsmall" color="text-gray-70">
          <DateTime date={report.date} fromNow />
        </Text>
      </Flex>
    </Box>
  );
}