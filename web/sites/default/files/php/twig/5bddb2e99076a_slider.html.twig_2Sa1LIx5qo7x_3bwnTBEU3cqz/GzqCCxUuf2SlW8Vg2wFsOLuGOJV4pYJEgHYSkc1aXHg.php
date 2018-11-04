<?php

/* @ongea_theme/components/slider.html.twig */
class __TwigTemplate_53563fe61379e01562dc0e6302e12ccf0ff66c019d4234bda52d078e3ac28ce2 extends Twig_Template
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
        $tags = array("if" => 2, "for" => 8, "set" => 9, "include" => 24);
        $filters = array("length" => 2, "t" => 31);
        $functions = array();

        try {
            $this->env->getExtension('Twig_Extension_Sandbox')->checkSecurity(
                array('if', 'for', 'set', 'include'),
                array('length', 't'),
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
        if ((twig_length_filter($this->env, ($context["slider_data"] ?? null)) > 0)) {
            // line 3
            echo "        <div class=\"slider\">
            <div class=\"row fix-height
                ";
            // line 5
            if ((twig_length_filter($this->env, ($context["slider_data"] ?? null)) < 4)) {
                echo " lg-flexed-content ";
            }
            // line 6
            echo "                ";
            if ((twig_length_filter($this->env, ($context["slider_data"] ?? null)) < 2)) {
                echo " md-flexed-content ";
            }
            // line 7
            echo "            \">
            ";
            // line 8
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(($context["slider_data"] ?? null));
            $context['loop'] = array(
              'parent' => $context['_parent'],
              'index0' => 0,
              'index'  => 1,
              'first'  => true,
            );
            if (is_array($context['_seq']) || (is_object($context['_seq']) && $context['_seq'] instanceof Countable)) {
                $length = count($context['_seq']);
                $context['loop']['revindex0'] = $length - 1;
                $context['loop']['revindex'] = $length;
                $context['loop']['length'] = $length;
                $context['loop']['last'] = 1 === $length;
            }
            foreach ($context['_seq'] as $context["key"] => $context["value"]) {
                // line 9
                echo "                ";
                $context["slider_content"] = "";
                // line 10
                echo "                ";
                $context["slider_content"] = array("nid" => $this->getAttribute(                // line 11
$context["value"], "nid", array()), "title" => $this->getAttribute(                // line 12
$context["value"], "title", array()), "logo" => $this->getAttribute(                // line 13
$context["value"], "logo", array()), "image" => array("url" => $this->getAttribute(                // line 15
$context["value"], "image", array())), "first_name" => $this->getAttribute(                // line 17
$context["value"], "first_name", array()), "last_name" => $this->getAttribute(                // line 18
$context["value"], "last_name", array()), "nickname" => $this->getAttribute(                // line 19
$context["value"], "nickname", array()), "show_name" => $this->getAttribute(                // line 20
$context["value"], "show_name", array()), "name" =>                 // line 21
($context["slider_name"] ?? null));
                // line 23
                echo "                <div class=\"col-lg-3 col-md-4 col-sm-6 slide ";
                if (($context["key"] < 1)) {
                    echo "slide-active";
                }
                echo " slide-";
                echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, $context["key"], "html", null, true));
                echo "\">
                    ";
                // line 24
                $this->loadTemplate("@ongea_theme/components/slider-box.html.twig", "@ongea_theme/components/slider.html.twig", 24)->display(array_merge($context, ($context["slider_content"] ?? null)));
                // line 25
                echo "                </div>

            ";
                ++$context['loop']['index0'];
                ++$context['loop']['index'];
                $context['loop']['first'] = false;
                if (isset($context['loop']['length'])) {
                    --$context['loop']['revindex0'];
                    --$context['loop']['revindex'];
                    $context['loop']['last'] = 0 === $context['loop']['revindex0'];
                }
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['key'], $context['value'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 28
            echo "            </div>
            <div class=\"row\">
                <div class=\"indicators\">
                    <div class=\"col-xs-4\"><span class=\"link prev hidden\" data=\"0\">";
            // line 31
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Previous")));
            echo "</span></div>
                    <div class=\"col-xs-4 text-center\"><span class=\"current\">1</span>/<span class=\"all\" data=\"";
            // line 32
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_length_filter($this->env, ($context["slider_data"] ?? null)), "html", null, true));
            echo "\">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->escapeFilter($this->env, twig_length_filter($this->env, ($context["slider_data"] ?? null)), "html", null, true));
            echo "</div>
                    <div class=\"col-xs-4 text-right\"><span class=\"link next ";
            // line 33
            if ((twig_length_filter($this->env, ($context["slider_data"] ?? null)) < 2)) {
                echo " hidden ";
            }
            echo "\" ";
            if ((twig_length_filter($this->env, ($context["slider_data"] ?? null)) > 1)) {
                echo " data=\"2\" ";
            }
            echo ">";
            echo $this->env->getExtension('Twig_Extension_Sandbox')->ensureToStringAllowed($this->env->getExtension('Drupal\Core\Template\TwigExtension')->renderVar(t("Next")));
            echo "</span></div>
                </div>
            </div>
        </div>
    ";
        }
    }

    public function getTemplateName()
    {
        return "@ongea_theme/components/slider.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  138 => 33,  132 => 32,  128 => 31,  123 => 28,  107 => 25,  105 => 24,  96 => 23,  94 => 21,  93 => 20,  92 => 19,  91 => 18,  90 => 17,  89 => 15,  88 => 13,  87 => 12,  86 => 11,  84 => 10,  81 => 9,  64 => 8,  61 => 7,  56 => 6,  52 => 5,  48 => 3,  46 => 2,  43 => 1,);
    }

    /** @deprecated since 1.27 (to be removed in 2.0). Use getSourceContext() instead */
    public function getSource()
    {
        @trigger_error('The '.__METHOD__.' method is deprecated since version 1.27 and will be removed in 2.0. Use getSourceContext() instead.', E_USER_DEPRECATED);

        return $this->getSourceContext()->getCode();
    }

    public function getSourceContext()
    {
        return new Twig_Source("", "@ongea_theme/components/slider.html.twig", "/var/www/de/ongea/web/themes/contrib/ongea_theme/templates/components/slider.html.twig");
    }
}
