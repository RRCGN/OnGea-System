<?php

/* themes/contrib/ongea_theme/templates/region/region--secondary-menu.html.twig */
class __TwigTemplate_f5fc3c401c7a01eb97f87312103ccbf58bd711160e99ede9376e77623ca3f7d5 extends Twig_Template
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
        $tags = array("set" => 2, "for" => 20, "if" => 21);
        $filters = array();
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('set', 'for', 'if'),
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
        echo "
";
        // line 2
        $context["used"] = array(0 => "socialmedia", 1 => "searchform", 2 => "userlogin", 3 => "languageswitcher");
        // line 3
        echo "
";
        // line 4
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "socialmedia", array()), "html", null, true));
        echo "

<div class=\"search-header\">
    <div class=\"row\">
        <div class=\"col-sm-4 col-xs-8\">
            ";
        // line 9
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "searchform", array()), "html", null, true));
        echo "
        </div>
        <div class=\"col-sm-4 col-xs-2 text-center\">
            ";
        // line 12
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "userlogin", array()), "html", null, true));
        echo "
        </div>
        <div class=\"col-sm-4 col-xs-2\">
            ";
        // line 15
        echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $this->getAttribute(($context["elements"] ?? null), "languageswitcher", array()), "html", null, true));
        echo "
        </div>
    </div>
</div>

";
        // line 20
        $context['_parent'] = $context;
        $context['_seq'] = twig_ensure_traversable(($context["elements"] ?? null));
        foreach ($context['_seq'] as $context["key"] => $context["value"]) {
            // line 21
            echo "    ";
            if (!twig_in_filter($context["key"], ($context["used"] ?? null))) {
                // line 22
                echo "        ";
                if (!twig_in_filter("#", $context["key"])) {
                    // line 23
                    echo "            ";
                    echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $context["value"], "html", null, true));
                    echo "
        ";
                }
                // line 25
                echo "    ";
            }
        }
        $_parent = $context['_parent'];
        unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
        $context = array_intersect_key($context, $_parent) + $_parent;
    }

    public function getTemplateName()
    {
        return "themes/contrib/ongea_theme/templates/region/region--secondary-menu.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  95 => 25,  89 => 23,  86 => 22,  83 => 21,  79 => 20,  71 => 15,  65 => 12,  59 => 9,  51 => 4,  48 => 3,  46 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "themes/contrib/ongea_theme/templates/region/region--secondary-menu.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/region/region--secondary-menu.html.twig");
    }
}
