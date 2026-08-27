// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'create_user_price_alert_body.dart';

// **************************************************************************
// BuiltValueGenerator
// **************************************************************************

const CreateUserPriceAlertBodyTriggerDirectionEnum
    _$createUserPriceAlertBodyTriggerDirectionEnum_above =
    const CreateUserPriceAlertBodyTriggerDirectionEnum._('above');
const CreateUserPriceAlertBodyTriggerDirectionEnum
    _$createUserPriceAlertBodyTriggerDirectionEnum_below =
    const CreateUserPriceAlertBodyTriggerDirectionEnum._('below');

CreateUserPriceAlertBodyTriggerDirectionEnum
    _$createUserPriceAlertBodyTriggerDirectionEnumValueOf(String name) {
  switch (name) {
    case 'above':
      return _$createUserPriceAlertBodyTriggerDirectionEnum_above;
    case 'below':
      return _$createUserPriceAlertBodyTriggerDirectionEnum_below;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateUserPriceAlertBodyTriggerDirectionEnum>
    _$createUserPriceAlertBodyTriggerDirectionEnumValues = BuiltSet<
        CreateUserPriceAlertBodyTriggerDirectionEnum>(const <CreateUserPriceAlertBodyTriggerDirectionEnum>[
  _$createUserPriceAlertBodyTriggerDirectionEnum_above,
  _$createUserPriceAlertBodyTriggerDirectionEnum_below,
]);

const CreateUserPriceAlertBodyLangEnum _$createUserPriceAlertBodyLangEnum_en =
    const CreateUserPriceAlertBodyLangEnum._('en');
const CreateUserPriceAlertBodyLangEnum _$createUserPriceAlertBodyLangEnum_id =
    const CreateUserPriceAlertBodyLangEnum._('id');

CreateUserPriceAlertBodyLangEnum _$createUserPriceAlertBodyLangEnumValueOf(
    String name) {
  switch (name) {
    case 'en':
      return _$createUserPriceAlertBodyLangEnum_en;
    case 'id':
      return _$createUserPriceAlertBodyLangEnum_id;
    default:
      throw ArgumentError(name);
  }
}

final BuiltSet<CreateUserPriceAlertBodyLangEnum>
    _$createUserPriceAlertBodyLangEnumValues = BuiltSet<
        CreateUserPriceAlertBodyLangEnum>(const <CreateUserPriceAlertBodyLangEnum>[
  _$createUserPriceAlertBodyLangEnum_en,
  _$createUserPriceAlertBodyLangEnum_id,
]);

Serializer<CreateUserPriceAlertBodyTriggerDirectionEnum>
    _$createUserPriceAlertBodyTriggerDirectionEnumSerializer =
    _$CreateUserPriceAlertBodyTriggerDirectionEnumSerializer();
Serializer<CreateUserPriceAlertBodyLangEnum>
    _$createUserPriceAlertBodyLangEnumSerializer =
    _$CreateUserPriceAlertBodyLangEnumSerializer();

class _$CreateUserPriceAlertBodyTriggerDirectionEnumSerializer
    implements
        PrimitiveSerializer<CreateUserPriceAlertBodyTriggerDirectionEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'above': 'above',
    'below': 'below',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'above': 'above',
    'below': 'below',
  };

  @override
  final Iterable<Type> types = const <Type>[
    CreateUserPriceAlertBodyTriggerDirectionEnum
  ];
  @override
  final String wireName = 'CreateUserPriceAlertBodyTriggerDirectionEnum';

  @override
  Object serialize(Serializers serializers,
          CreateUserPriceAlertBodyTriggerDirectionEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateUserPriceAlertBodyTriggerDirectionEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateUserPriceAlertBodyTriggerDirectionEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateUserPriceAlertBodyLangEnumSerializer
    implements PrimitiveSerializer<CreateUserPriceAlertBodyLangEnum> {
  static const Map<String, Object> _toWire = const <String, Object>{
    'en': 'en',
    'id': 'id',
  };
  static const Map<Object, String> _fromWire = const <Object, String>{
    'en': 'en',
    'id': 'id',
  };

  @override
  final Iterable<Type> types = const <Type>[CreateUserPriceAlertBodyLangEnum];
  @override
  final String wireName = 'CreateUserPriceAlertBodyLangEnum';

  @override
  Object serialize(
          Serializers serializers, CreateUserPriceAlertBodyLangEnum object,
          {FullType specifiedType = FullType.unspecified}) =>
      _toWire[object.name] ?? object.name;

  @override
  CreateUserPriceAlertBodyLangEnum deserialize(
          Serializers serializers, Object serialized,
          {FullType specifiedType = FullType.unspecified}) =>
      CreateUserPriceAlertBodyLangEnum.valueOf(
          _fromWire[serialized] ?? (serialized is String ? serialized : ''));
}

class _$CreateUserPriceAlertBody extends CreateUserPriceAlertBody {
  @override
  final String instrument;
  @override
  final num targetPrice;
  @override
  final CreateUserPriceAlertBodyTriggerDirectionEnum triggerDirection;
  @override
  final String? note;
  @override
  final CreateUserPriceAlertBodyLangEnum? lang;

  factory _$CreateUserPriceAlertBody(
          [void Function(CreateUserPriceAlertBodyBuilder)? updates]) =>
      (CreateUserPriceAlertBodyBuilder()..update(updates))._build();

  _$CreateUserPriceAlertBody._(
      {required this.instrument,
      required this.targetPrice,
      required this.triggerDirection,
      this.note,
      this.lang})
      : super._();
  @override
  CreateUserPriceAlertBody rebuild(
          void Function(CreateUserPriceAlertBodyBuilder) updates) =>
      (toBuilder()..update(updates)).build();

  @override
  CreateUserPriceAlertBodyBuilder toBuilder() =>
      CreateUserPriceAlertBodyBuilder()..replace(this);

  @override
  bool operator ==(Object other) {
    if (identical(other, this)) return true;
    return other is CreateUserPriceAlertBody &&
        instrument == other.instrument &&
        targetPrice == other.targetPrice &&
        triggerDirection == other.triggerDirection &&
        note == other.note &&
        lang == other.lang;
  }

  @override
  int get hashCode {
    var _$hash = 0;
    _$hash = $jc(_$hash, instrument.hashCode);
    _$hash = $jc(_$hash, targetPrice.hashCode);
    _$hash = $jc(_$hash, triggerDirection.hashCode);
    _$hash = $jc(_$hash, note.hashCode);
    _$hash = $jc(_$hash, lang.hashCode);
    _$hash = $jf(_$hash);
    return _$hash;
  }

  @override
  String toString() {
    return (newBuiltValueToStringHelper(r'CreateUserPriceAlertBody')
          ..add('instrument', instrument)
          ..add('targetPrice', targetPrice)
          ..add('triggerDirection', triggerDirection)
          ..add('note', note)
          ..add('lang', lang))
        .toString();
  }
}

class CreateUserPriceAlertBodyBuilder
    implements
        Builder<CreateUserPriceAlertBody, CreateUserPriceAlertBodyBuilder> {
  _$CreateUserPriceAlertBody? _$v;

  String? _instrument;
  String? get instrument => _$this._instrument;
  set instrument(String? instrument) => _$this._instrument = instrument;

  num? _targetPrice;
  num? get targetPrice => _$this._targetPrice;
  set targetPrice(num? targetPrice) => _$this._targetPrice = targetPrice;

  CreateUserPriceAlertBodyTriggerDirectionEnum? _triggerDirection;
  CreateUserPriceAlertBodyTriggerDirectionEnum? get triggerDirection =>
      _$this._triggerDirection;
  set triggerDirection(
          CreateUserPriceAlertBodyTriggerDirectionEnum? triggerDirection) =>
      _$this._triggerDirection = triggerDirection;

  String? _note;
  String? get note => _$this._note;
  set note(String? note) => _$this._note = note;

  CreateUserPriceAlertBodyLangEnum? _lang;
  CreateUserPriceAlertBodyLangEnum? get lang => _$this._lang;
  set lang(CreateUserPriceAlertBodyLangEnum? lang) => _$this._lang = lang;

  CreateUserPriceAlertBodyBuilder() {
    CreateUserPriceAlertBody._defaults(this);
  }

  CreateUserPriceAlertBodyBuilder get _$this {
    final $v = _$v;
    if ($v != null) {
      _instrument = $v.instrument;
      _targetPrice = $v.targetPrice;
      _triggerDirection = $v.triggerDirection;
      _note = $v.note;
      _lang = $v.lang;
      _$v = null;
    }
    return this;
  }

  @override
  void replace(CreateUserPriceAlertBody other) {
    _$v = other as _$CreateUserPriceAlertBody;
  }

  @override
  void update(void Function(CreateUserPriceAlertBodyBuilder)? updates) {
    if (updates != null) updates(this);
  }

  @override
  CreateUserPriceAlertBody build() => _build();

  _$CreateUserPriceAlertBody _build() {
    final _$result = _$v ??
        _$CreateUserPriceAlertBody._(
          instrument: BuiltValueNullFieldError.checkNotNull(
              instrument, r'CreateUserPriceAlertBody', 'instrument'),
          targetPrice: BuiltValueNullFieldError.checkNotNull(
              targetPrice, r'CreateUserPriceAlertBody', 'targetPrice'),
          triggerDirection: BuiltValueNullFieldError.checkNotNull(
              triggerDirection,
              r'CreateUserPriceAlertBody',
              'triggerDirection'),
          note: note,
          lang: lang,
        );
    replace(_$result);
    return _$result;
  }
}

// ignore_for_file: deprecated_member_use_from_same_package,type=lint
