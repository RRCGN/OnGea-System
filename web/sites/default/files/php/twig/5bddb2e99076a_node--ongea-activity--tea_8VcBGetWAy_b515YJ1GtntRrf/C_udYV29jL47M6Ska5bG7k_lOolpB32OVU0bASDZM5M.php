<?php

/* themes/contrib/ongea_theme/templates/node/teaser_node/node--ongea-activity--teaser.html.twig */
class __TwigTemplate_cdf1aae43e38d4db7698a5694d29c320aa0b5f5a723ce67c8abd99798601a1cd extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        $this->parent = false;

        $this->blocks = array(
        );
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $tags = array("include" => 1);
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('include'),
                array(),
                array()
            );
        } catch (Twig_Sandbox_SecurityError $e) {
            $e->setSourceContext($this->getSourceContext());

            if ($e instanceof Twig_Sandbox_SecurityNotAllowedTagError && isset($tags[$e->getTagName()])) {
                $e->setTemplateLine($tags[$e->getTagName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFilterError && isset($filters[$e->getFilterName()])) {
                $e->setTemplateLine($filters[$e->getFilterName()]);
            } elseif ($e instanceof Twig_Sandbox_SecurityNotAllowedFunctionError && isset($functions[$e->getFunctionName()])) {
                $e->setTemplateLine($functions[$e->getFunctionName()]);
            }

            throw $e;
        }

        // line 1
        $this->loadTemplate("@ongea_theme/node/node/activity.html.twig", "themes/contrib/ongea_theme/templates/node/teaser_node/node--ongea-activity--teaser.html.twig", 1)->display(array_merge($context, array("listname" => "large-list teaser-list")));
    }

    public function getTemplateName()
    {
        return "themes/contrib/ongea_theme/templates/node/teaser_node/node--ongea-activity--teaser.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/contrib/ongea_theme/templates/node/teaser_node/node--ongea-activity--teaser.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/node/teaser_node/node--ongea-activity--teaser.html.twig");
    }
}
