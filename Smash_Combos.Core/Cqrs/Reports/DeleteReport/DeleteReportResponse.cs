﻿using System;
using System.Collections.Generic;
using System.Text;

namespace Smash_Combos.Core.Cqrs.Reports.DeleteReport
{
    public class DeleteReportResponse
    {
        public bool Success { get; set; }
        public ReportDto Report { get; set; }
    }
}