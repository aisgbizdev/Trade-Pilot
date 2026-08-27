// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'outbound_click_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const OutboundClickBodyPlacementEnum _$outboundClickBodyPlacementEnum_splash =
    const OutboundClickBodyPlacementEnum._('splash');
const OutboundClickBodyPlacementEnum
    _$outboundClickBodyPlacementEnum_landingHeader =
    const OutboundClickBodyPlacementEnum._('landingHeader');
const OutboundClickBodyPlacementEnum
    _$outboundClickBodyPlacementEnum_landingCta =
    const OutboundClickBodyPlacementEnum._('landingCta');
const OutboundClickBodyPlacementEnum
    _$outboundClickBodyPlacementEnum_landingFooter =
    const OutboundClickBodyPlacementEnum._('landingFooter');
const OutboundClickBodyPlacementEnum
    _$outboundClickBodyPlacementEnum_layoutFooter =
    const OutboundClickBodyPlacementEnum._('layoutFooter');
const OutboundClickBodyPlacementEnum
    _$outboundClickBodyPlacementEnum_profileCta =
    const OutboundClickBodyPlacementEnum._('profileCta');
const OutboundClickBodyPlacementEnum
    _$outboundClickBodyPlacementEnum_dashboardTiktok =
    const OutboundClickBodyPlacementEnum._('dashboardTiktok');

OutboundClickBodyPlacementEnum _$outboundClickBodyPlacementEnumValueOf(
    String name) {
  switch (name) {
    case 'splash':
      return _$outboundClickBodyPlacementEnum_splash;
    case 'landingHeader':
      return _$outboundClickBodyPlacementEnum_landingHeader;
    case 'landingCta':
      return _$outboundClickBodyPlacementEnum_landingCta;
    case 'landingFooter':
      return _$outboundClickBodyPlacementEnum_landingFooter;
    case 'layoutFooter':
      return _$outboundClickBodyPlacementEnum_layoutFooter;
    case 'profileCta':
      return _$outboundClickBodyPlacementEnum_profileCta;
    case 'dashboardTiktok':
      return _$outboundClickBodyPlacementEnum_dashboardTiktok;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<OutboundClickBodyPlacementEnum>
    _$outboundClickBodyPlacementEnumValues = BuiltSet<
        OutboundClickBodyPlacementEnum>(const <OutboundClickBodyPlacementEnum>[
  _$outboundClickBodyPlacementEnum_splash,
  _$outboundClickBodyPlacementEnum_landingHeader,
  _$outboundClickBodyPlacementEnum_landingCta,
  _$outboundClickBodyPlacementEnum_landingFooter,
  _$outboundClickBodyPlacementEnum_layoutFooter,
  _$outboundClickBodyPlacementEnum_profileCta,
  _$outboundClickBodyPlacementEnum_dashboardTiktok,
]);

const OutboundClickBodyTargetEnum _$outboundClickBodyTargetEnum_sgBerjangka =
    const OutboundClickBodyTargetEnum._('sgBerjangka');
const OutboundClickBodyTargetEnum _$outboundClickBodyTargetEnum_tiktok =
    const OutboundClickBodyTargetEnum._('tiktok');

OutboundClickBodyTargetEnum _$outboundClickBodyTargetEnumValueOf(String name) {
  switch (name) {
    case 'sgBerjangka':
      return _$outboundClickBodyTargetEnum_sgBerjangka;
    case 'tiktok':
      return _$outboundClickBodyTargetEnum_tiktok;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<OutboundClickBodyTargetEnum>
    _$outboundClickBodyTargetEnumValues =
    BuiltSet<OutboundClickBodyTargetEnum>(const <OutboundClickBodyTargetEnum>[
  _$outboundClickBodyTargetEnum_sgBerjangka,
  _$outboundClickBodyTargetEnum_tiktok,
]);

const OutboundClickBodyLangEnum _$outboundClickBodyLangEnum_en =
    const OutboundClickBodyLangEnum._('en');
const OutboundClickBodyLangEnum _$outboundClickBodyLangEnum_id =
    const OutboundClickBodyLangEnum._('id');

OutboundClickBodyLangEnum _$outboundClickBodyLangEnumValueOf(String name) {
  switch (name) {
    case 'en':
      return _$outboundClickBodyLangEnum_en;
    case 'id':
      return _$outboundClickBodyLangEnum_id;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<OutboundClickBodyLangEnum> _$outboundClickBodyLangEnumValues =
    BuiltSet<OutboundClickBodyLangEnum>(const <OutboundClickBodyLangEnum>[
  _$outboundClickBodyLangEnum_en,
  _$outboundClickBodyLangEnum_id,
]);

Serializer<OutboundClickBodyPlacementEnum>
    _$outboundClickBodyPlacementEnumSerializer =
    _$OutboundClickBodyPlacementEnumSerializer();
Serializer<OutboundClickBodyTargetEnum>
    _$outboundClickBodyTargetEnumSerializer =
    _$OutboundClickBodyTargetEnumSerializer();
Serializer<OutboundClickBodyLangEnum> _$outboundClickBodyLangEnumSerializer =
    _$OutboundClickBodyLangEnumSerializer();

class _$OutboundClickBodyPlacementEnumSerializer
    implements PrimitiveSerializer<OutboundClickBodyPlacementEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'splash': 'splash',
    'landingHeader': 'landing-header',
    'landingCta': 'landing-cta',
    'landingFooter': 'landing-footer',
    'layoutFooter': 'layout-footer',
    'profileCta': 'profile-cta',
    'dashboardTiktok': 'dashboard-tiktok',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'splash': 'splash',
    'landing-header': 'landingHeader',
    'landing-cta': 'landingCta',
    'landing-footer': 'landingFooter',
    'layout-footer': 'layoutFooter',
    'profile-cta': 'profileCta',
    'dashboard-tiktok': 'dashboardTiktok',
  };

  @override
  final Iterable<Type> types = const <Type>[OutboundClickBodyPlacementEnum];
  @override
  final String wireName = 'OutboundClickBodyPlacementEnum';

  @override
  Object serialize(
          Serializers serializers, OutboundClickBodyPlacementEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  OutboundClickBodyPlacementEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      OutboundClickBodyPlacementEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$OutboundClickBodyTargetEnumSerializer
    implements PrimitiveSerializer<OutboundClickBodyTargetEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'sgBerjangka': 'sg-berjangka',
    'tiktok': 'tiktok',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'sg-berjangka': 'sgBerjangka',
    'tiktok': 'tiktok',
  };

  @override
  final Iterable<Type> types = const <Type>[OutboundClickBodyTargetEnum];
  @override
  final String wireName = 'OutboundClickBodyTargetEnum';

  @override
  Object serialize(Serializers serializers, OutboundClickBodyTargetEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  OutboundClickBodyTargetEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      OutboundClickBodyTargetEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$OutboundClickBodyLangEnumSerializer
    implements PrimitiveSerializer<OutboundClickBodyLangEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'en': 'en',
    'id': 'id',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'en': 'en',
    'id': 'id',
  };

  @override
  final Iterable<Type> types = const <Type>[OutboundClickBodyLangEnum];
  @override
  final String wireName = 'OutboundClickBodyLangEnum';

  @override
  Object serialize(Serializers serializers, OutboundClickBodyLangEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  OutboundClickBodyLangEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      OutboundClickBodyLangEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$OutboundClickBody extends OutboundClickBody {
  @override
  final OutboundClickBodyPlacementEnum placement;
  @override
  final OutboundClickBodyTargetEnum target;
  @override
  final OutboundClickBodyLangEnum? lang;

  factory _$OutboundClickBody(
          [void Function(OutboundClickBodyBuilder)? updates]) =>
      (OutboundClickBodyBuilder()..update(updates))._build();

  _$OutboundClickBody._(
      {required this.placement, required this.target, this.lang})
      : super._();
  @override
  OutboundClickBody rebuild(void Function(OutboundClickBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  OutboundClickBodyBuilder toBuilder() =>
      OutboundClickBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is OutboundClickBody &&
        placement == other.placement &&
        target == other.target &&
        lang == other.lang;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, placement.hashCode);
    _$hash = $jc(_$hash, target.hashCode);
    _$hash = $jc(_$hash, lang.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'OutboundClickBody')
          ..add('placement', placement)
          ..add('target', target)
          ..add('lang', lang))
        .toString();
  }
}

class OutboundClickBodyBuilder
    implements Builder<OutboundClickBody, OutboundClickBodyBuilder> {
  _$OutboundClickBody? _$v;

  OutboundClickBodyPlacementEnum? _placement;
  OutboundClickBodyPlacementEnum? get placement => _$this._placement;
  set placement(OutboundClickBodyPlacementEnum? placement) =>
      _$this._placement = placement;

  OutboundClickBodyTargetEnum? _target;
  OutboundClickBodyTargetEnum? get target => _$this._target;
  set target(OutboundClickBodyTargetEnum? target) => _$this._target = target;

  OutboundClickBodyLangEnum? _lang;
  OutboundClickBodyLangEnum? get lang => _$this._lang;
  set lang(OutboundClickBodyLangEnum? lang) => _$this._lang = lang;

  OutboundClickBodyBuilder() {
    OutboundClickBody._defaults(this);
  }

  OutboundClickBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _placement = $v.placement;
      _target = $v.target;
      _lang = $v.lang;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(OutboundClickBody other) {
    _$v = other as _$OutboundClickBody;
  }

  @override
  void update(void Function(OutboundClickBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  OutboundClickBody build() => _build();

  _$OutboundClickBody _build() {
    final _$result = _$v ??
        _$OutboundClickBody._(
          placement: BuiltValueNullFieldError.checkNotNull(
              placement, r'OutboundClickBody', 'placement'),
          target: BuiltValueNullFieldError.checkNotNull(
              target, r'OutboundClickBody', 'target'),
          lang: lang,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
