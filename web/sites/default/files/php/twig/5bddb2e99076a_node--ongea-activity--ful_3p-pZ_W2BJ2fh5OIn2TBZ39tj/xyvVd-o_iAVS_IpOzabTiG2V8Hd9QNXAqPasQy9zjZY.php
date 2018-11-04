<?php

/* themes/contrib/ongea_theme/templates/node/full_node/node--ongea-activity--full.html.twig */
class __TwigTemplate_ffaaafe4b0045e65b8219d3a495a3c0c2b0ce31cf376e5ae31880750e2f01d61 extends Twig_Template
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
        $tags = array("set" => 11, "include" => 53);
        $filters = array("clean_class" => 38);
        $functions = array("file_url" => 22);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('set', 'include'),
                array('clean_class'),
                array('file_url')
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

        // line 2
        echo "
";
        // line 9
        echo "
";
        // line 11
        $context["data"] = array("date" => array("from" => $this->getAttribute($this->getAttribute(        // line 13
($context["node"] ?? null), "field_ongea_datefrom", array()), "value", array()), "to" => $this->getAttribute($this->getAttribute(        // line 14
($context["node"] ?? null), "field_ongea_dateto", array()), "value", array())), "nid" => $this->getAttribute(        // line 16
($context["node"] ?? null), "id", array()), "name" => $this->getAttribute(        // line 17
($context["node"] ?? null), "label", array()), "title" => $this->getAttribute(        // line 18
($context["node"] ?? null), "label", array()), "subtitle" => $this->getAttribute($this->getAttribute(        // line 19
($context["node"] ?? null), "field_ongea_subtitle", array()), "value", array()), "description" => $this->getAttribute($this->getAttribute(        // line 20
($context["node"] ?? null), "field_ongea_description", array()), "value", array()), "image" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 22
($context["node"] ?? null), "field_ongea_activity_image", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute(        // line 23
($context["node"] ?? null), "field_ongea_activity_image", array()), "alt", array())), "project" => $this->getAttribute(        // line 25
($context["node"] ?? null), "field_ongea_project", array()), "breadcrumbs" =>         // line 26
($context["breadcrumbs"] ?? null), "prev" =>         // line 27
($context["prev"] ?? null), "next" =>         // line 28
($context["next"] ?? null), "login" =>         // line 29
($context["login_form"] ?? null), "register" =>         // line 30
($context["register_form"] ?? null), "profiles" =>         // line 31
($context["activity_people"] ?? null), "organisations" =>         // line 32
($context["activity_organisations"] ?? null));
        // line 35
        echo "
";
        // line 37
        $context["classes"] = array(0 => \Drupal\Component\Utility\Html::getClass($this->getAttribute(        // line 38
($context["node"] ?? null), "bundle", array())), 1 => (($this->getAttribute(        // line 39
($context["node"] ?? null), "isPromoted", array(), "method")) ? ("is-promoted") : ("")), 2 => (($this->getAttribute(        // line 40
($context["node"] ?? null), "isSticky", array(), "method")) ? ("is-sticky") : ("")), 3 => (( !$this->getAttribute(        // line 41
($context["node"] ?? null), "isPublished", array(), "method")) ? ("is-unpublished") : ("")), 4 => ((        // line 42
($context["view_mode"] ?? null)) ? (\Drupal\Component\Utility\Html::getClass(($context["view_mode"] ?? null))) : ("")), 5 => "clearfix");
        // line 46
        echo "<article";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["attributes"] ?? null), "addClass", array(0 => ($context["classes"] ?? null)), "method"), "html", null, true));
        echo ">
    ";
        // line 47
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_prefix"] ?? null), "html", null, true));
        echo "
    ";
        // line 48
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_suffix"] ?? null), "html", null, true));
        echo "

    <section class=\"page-container -organization\">
        <div class=\"row\">
            
            ";
        // line 53
        $this->loadTemplate("@ongea_theme/components/full-content.html.twig", "themes/contrib/ongea_theme/templates/node/full_node/node--ongea-activity--full.html.twig", 53)->display(array_merge($context, ($context["data"] ?? null)));
        // line 54
        echo "
            ";
        // line 57
        echo "
        </div>
    </section>

</article>

";
    }

    public function getTemplateName()
    {
        return "themes/contrib/ongea_theme/templates/node/full_node/node--ongea-activity--full.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  100 => 57,  97 => 54,  95 => 53,  87 => 48,  83 => 47,  78 => 46,  76 => 42,  75 => 41,  74 => 40,  73 => 39,  72 => 38,  71 => 37,  68 => 35,  66 => 32,  65 => 31,  64 => 30,  63 => 29,  62 => 28,  61 => 27,  60 => 26,  59 => 25,  58 => 23,  57 => 22,  56 => 20,  55 => 19,  54 => 18,  53 => 17,  52 => 16,  51 => 14,  50 => 13,  49 => 11,  46 => 9,  43 => 2,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/contrib/ongea_theme/templates/node/full_node/node--ongea-activity--full.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/node/full_node/node--ongea-activity--full.html.twig");
    }
}
