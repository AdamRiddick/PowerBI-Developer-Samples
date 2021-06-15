// ----------------------------------------------------------------------------
// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.
// ----------------------------------------------------------------------------

namespace AppOwnsData.Controllers
{
    using Microsoft.AspNetCore.Mvc;

    public class BookmarksController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Share()
        {
            return View();
        }
    }
}
