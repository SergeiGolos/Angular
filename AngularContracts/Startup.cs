using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(AngularContracts.Startup))]
namespace AngularContracts
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
