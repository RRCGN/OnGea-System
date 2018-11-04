<?php

/* @ongea_theme/node/node/organisation.html.twig */
class __TwigTemplate_2ba1887d5c96098be69e44f17b270db82c28b0ff4b0be6325403fe4b247c3cba extends Twig_Template
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
        $tags = array("set" => 3, "include" => 40);
        $filters = array("striptags" => 3, "render" => 3, "t" => 4, "length" => 13, "raw" => 13, "slice" => 13, "clean_class" => 30);
        $functions = array("file_url" => 15);

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('set', 'include'),
                array('striptags', 'render', 't', 'length', 'raw', 'slice', 'clean_class'),
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
        // line 3
        $context["text"] = strip_tags($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar($this->getAttribute($this->getAttribute(($context["node"] ?? null), "field_ongea_about_us", array()), "value", array())));
        // line 4
        $context["type"] = t("Organisation");
        // line 5
        $context["data"] = array("nid" => $this->getAttribute(        // line 6
($context["node"] ?? null), "id", array()), "title" => $this->getAttribute(        // line 7
($context["node"] ?? null), "label", array()), "description" => $this->getAttribute($this->getAttribute($this->getAttribute(        // line 8
($context["node"] ?? null), "field_ongea_webpage", array()), "url", array()), "value", array()), "website" => array("url" => $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 10
($context["node"] ?? null), "field_ongea_webpage", array()), "value", array()), 0, array()), "uri", array()), "title" => $this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 11
($context["node"] ?? null), "field_ongea_webpage", array()), "value", array()), 0, array()), "title", array())), "body" => (((twig_length_filter($this->env,         // line 13
($context["text"] ?? null)) > 450)) ? ((twig_slice($this->env, ($context["text"] ?? null), 0, 450) . "...")) : (($context["text"] ?? null))), "image" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 15
($context["node"] ?? null), "field_ongea_organisation_image", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute(        // line 16
($context["node"] ?? null), "field_ongea_organisation_image", array()), "alt", array())), "logo" => array("url" => call_user_func_array($this->env->getFunction('file_url')->getCallable(), array($this->getAttribute($this->getAttribute($this->getAttribute($this->getAttribute(        // line 19
($context["node"] ?? null), "field_ongea_organisation_logo", array()), "entity", array()), "uri", array()), "value", array()))), "alt" => $this->getAttribute($this->getAttribute(        // line 20
($context["node"] ?? null), "field_ongea_organisation_logo", array()), "alt", array())), "town" => $this->getAttribute($this->getAttribute(        // line 22
($context["node"] ?? null), "field_ongea_town", array()), "value", array()), "country" => $this->getAttribute($this->getAttribute(        // line 23
($context["node"] ?? null), "field_ongea_country", array()), "value", array()), "type" =>         // line 24
($context["type"] ?? null), "listname" =>         // line 25
($context["listname"] ?? null));
        // line 27
        echo "
";
        // line 29
        $context["classes"] = array(0 => \Drupal\Component\Utility\Html::getClass($this->getAttribute(        // line 30
($context["node"] ?? null), "bundle", array())), 1 => (($this->getAttribute(        // line 31
($context["node"] ?? null), "isPromoted", array(), "method")) ? ("is-promoted") : ("")), 2 => (($this->getAttribute(        // line 32
($context["node"] ?? null), "isSticky", array(), "method")) ? ("is-sticky") : ("")), 3 => (( !$this->getAttribute(        // line 33
($context["node"] ?? null), "isPublished", array(), "method")) ? ("is-unpublished") : ("")), 4 => ((        // line 34
($context["view_mode"] ?? null)) ? (\Drupal\Component\Utility\Html::getClass(($context["view_mode"] ?? null))) : ("")), 5 => "clearfix");
        // line 38
        echo "<article";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["attributes"] ?? null), "addClass", array(0 => ($context["classes"] ?? null)), "method"), "html", null, true));
        echo ">
    ";
        // line 39
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_prefix"] ?? null), "html", null, true));
        echo "
        ";
        // line 40
        $this->loadTemplate("@ongea_theme/components/lists/universal-list.html.twig", "@ongea_theme/node/node/organisation.html.twig", 40)->display(array_merge($context, ($context["data"] ?? null)));
        // line 41
        echo "    ";
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, ($context["title_suffix"] ?? null), "html", null, true));
        echo "
</article>
";
    }

    public function getTemplateName()
    {
        return "@ongea_theme/node/node/organisation.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  87 => 41,  85 => 40,  81 => 39,  76 => 38,  74 => 34,  73 => 33,  72 => 32,  71 => 31,  70 => 30,  69 => 29,  66 => 27,  64 => 25,  63 => 24,  62 => 23,  61 => 22,  60 => 20,  59 => 19,  58 => 16,  57 => 15,  56 => 13,  55 => 11,  54 => 10,  53 => 8,  52 => 7,  51 => 6,  50 => 5,  48 => 4,  46 => 3,  43 => 2,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/node/node/organisation.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/node/node/organisation.html.twig");
    }
}
