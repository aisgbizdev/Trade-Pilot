//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/create_journal_entry_body_entry_price.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'create_journal_entry_body.g.dart';

/// CreateJournalEntryBody
///
/// Properties:
/// * [analysisId] 
/// * [instrument] 
/// * [side] 
/// * [entryPrice] 
/// * [exitPrice] 
/// * [quantity] 
/// * [pnlAmount] 
/// * [pnlPercent] 
/// * [outcome] 
/// * [mood] 
/// * [note] 
/// * [tradedAt] 
@BuiltValue()
abstract class CreateJournalEntryBody implements Built<CreateJournalEntryBody, CreateJournalEntryBodyBuilder> {
  @BuiltValueField(wireName: r'analysisId')
  int? get analysisId;

  @BuiltValueField(wireName: r'instrument')
  String get instrument;

  @BuiltValueField(wireName: r'side')
  CreateJournalEntryBodySideEnum get side;
  // enum sideEnum {  buy,  sell,  };

  @BuiltValueField(wireName: r'entryPrice')
  CreateJournalEntryBodyEntryPrice? get entryPrice;

  @BuiltValueField(wireName: r'exitPrice')
  CreateJournalEntryBodyEntryPrice? get exitPrice;

  @BuiltValueField(wireName: r'quantity')
  CreateJournalEntryBodyEntryPrice? get quantity;

  @BuiltValueField(wireName: r'pnlAmount')
  CreateJournalEntryBodyEntryPrice? get pnlAmount;

  @BuiltValueField(wireName: r'pnlPercent')
  CreateJournalEntryBodyEntryPrice? get pnlPercent;

  @BuiltValueField(wireName: r'outcome')
  CreateJournalEntryBodyOutcomeEnum? get outcome;
  // enum outcomeEnum {  win,  loss,  breakeven,  open,  skipped,  };

  @BuiltValueField(wireName: r'mood')
  String? get mood;

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'tradedAt')
  DateTime? get tradedAt;

  CreateJournalEntryBody._();

  factory CreateJournalEntryBody([void updates(CreateJournalEntryBodyBuilder b)]) = _$CreateJournalEntryBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(CreateJournalEntryBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<CreateJournalEntryBody> get serializer => _$CreateJournalEntryBodySerializer();
}

class _$CreateJournalEntryBodySerializer implements PrimitiveSerializer<CreateJournalEntryBody> {
  @override
  final Iterable<Type> types = const [CreateJournalEntryBody, _$CreateJournalEntryBody];

  @override
  final String wireName = r'CreateJournalEntryBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    CreateJournalEntryBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.analysisId != null) {
      yield r'analysisId';
      yield serializers.serialize(
        object.analysisId,
        specifiedType: const FullType(int),
      );
    }
    yield r'instrument';
    yield serializers.serialize(
      object.instrument,
      specifiedType: const FullType(String),
    );
    yield r'side';
    yield serializers.serialize(
      object.side,
      specifiedType: const FullType(CreateJournalEntryBodySideEnum),
    );
    if (object.entryPrice != null) {
      yield r'entryPrice';
      yield serializers.serialize(
        object.entryPrice,
        specifiedType: const FullType(CreateJournalEntryBodyEntryPrice),
      );
    }
    if (object.exitPrice != null) {
      yield r'exitPrice';
      yield serializers.serialize(
        object.exitPrice,
        specifiedType: const FullType(CreateJournalEntryBodyEntryPrice),
      );
    }
    if (object.quantity != null) {
      yield r'quantity';
      yield serializers.serialize(
        object.quantity,
        specifiedType: const FullType(CreateJournalEntryBodyEntryPrice),
      );
    }
    if (object.pnlAmount != null) {
      yield r'pnlAmount';
      yield serializers.serialize(
        object.pnlAmount,
        specifiedType: const FullType(CreateJournalEntryBodyEntryPrice),
      );
    }
    if (object.pnlPercent != null) {
      yield r'pnlPercent';
      yield serializers.serialize(
        object.pnlPercent,
        specifiedType: const FullType(CreateJournalEntryBodyEntryPrice),
      );
    }
    if (object.outcome != null) {
      yield r'outcome';
      yield serializers.serialize(
        object.outcome,
        specifiedType: const FullType(CreateJournalEntryBodyOutcomeEnum),
      );
    }
    if (object.mood != null) {
      yield r'mood';
      yield serializers.serialize(
        object.mood,
        specifiedType: const FullType(String),
      );
    }
    if (object.note != null) {
      yield r'note';
      yield serializers.serialize(
        object.note,
        specifiedType: const FullType(String),
      );
    }
    if (object.tradedAt != null) {
      yield r'tradedAt';
      yield serializers.serialize(
        object.tradedAt,
        specifiedType: const FullType(DateTime),
      );
    }
  }

  @override
  Object serialize(
    Serializers serializers,
    CreateJournalEntryBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required CreateJournalEntryBodyBuilder result,
    required List<Object?> unhandled,
  }) {
    for (var i = 0; i < serializedList.length; i += 2) {
      final key = serializedList[i] as String;
      final value = serializedList[i + 1];
      switch (key) {
        case r'analysisId':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(int),
          ) as int?;
          if (valueDes == null) continue;
          result.analysisId = valueDes;
          break;
        case r'instrument':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(String),
          ) as String;
          result.instrument = valueDes;
          break;
        case r'side':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType(CreateJournalEntryBodySideEnum),
          ) as CreateJournalEntryBodySideEnum;
          result.side = valueDes;
          break;
        case r'entryPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateJournalEntryBodyEntryPrice),
          ) as CreateJournalEntryBodyEntryPrice?;
          if (valueDes == null) continue;
          result.entryPrice.replace(valueDes);
          break;
        case r'exitPrice':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateJournalEntryBodyEntryPrice),
          ) as CreateJournalEntryBodyEntryPrice?;
          if (valueDes == null) continue;
          result.exitPrice.replace(valueDes);
          break;
        case r'quantity':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateJournalEntryBodyEntryPrice),
          ) as CreateJournalEntryBodyEntryPrice?;
          if (valueDes == null) continue;
          result.quantity.replace(valueDes);
          break;
        case r'pnlAmount':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateJournalEntryBodyEntryPrice),
          ) as CreateJournalEntryBodyEntryPrice?;
          if (valueDes == null) continue;
          result.pnlAmount.replace(valueDes);
          break;
        case r'pnlPercent':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateJournalEntryBodyEntryPrice),
          ) as CreateJournalEntryBodyEntryPrice?;
          if (valueDes == null) continue;
          result.pnlPercent.replace(valueDes);
          break;
        case r'outcome':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(CreateJournalEntryBodyOutcomeEnum),
          ) as CreateJournalEntryBodyOutcomeEnum?;
          if (valueDes == null) continue;
          result.outcome = valueDes;
          break;
        case r'mood':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.mood = valueDes;
          break;
        case r'note':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.note = valueDes;
          break;
        case r'tradedAt':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(DateTime),
          ) as DateTime?;
          if (valueDes == null) continue;
          result.tradedAt = valueDes;
          break;
        default:
          unhandled.add(key);
          unhandled.add(value);
          break;
      }
    }
  }

  @override
  CreateJournalEntryBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = CreateJournalEntryBodyBuilder();
    final serializedList = (serialized as Iterable<Object?>).toList();
    final unhandled = <Object?>[];
    _deserializeProperties(
      serializers,
      serialized,
      specifiedType: specifiedType,
      serializedList: serializedList,
      unhandled: unhandled,
      result: result,
    );
    return result.build();
  }
}

class CreateJournalEntryBodySideEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'buy')
  static const CreateJournalEntryBodySideEnum buy = _$createJournalEntryBodySideEnum_buy;
  @BuiltValueEnumConst(wireName: r'sell')
  static const CreateJournalEntryBodySideEnum sell = _$createJournalEntryBodySideEnum_sell;

  static Serializer<CreateJournalEntryBodySideEnum> get serializer => _$createJournalEntryBodySideEnumSerializer;

  const CreateJournalEntryBodySideEnum._(String name): super(name);

  static BuiltSet<CreateJournalEntryBodySideEnum> get values => _$createJournalEntryBodySideEnumValues;
  static CreateJournalEntryBodySideEnum valueOf(String name) => _$createJournalEntryBodySideEnumValueOf(name);
}

class CreateJournalEntryBodyOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'win')
  static const CreateJournalEntryBodyOutcomeEnum win = _$createJournalEntryBodyOutcomeEnum_win;
  @BuiltValueEnumConst(wireName: r'loss')
  static const CreateJournalEntryBodyOutcomeEnum loss = _$createJournalEntryBodyOutcomeEnum_loss;
  @BuiltValueEnumConst(wireName: r'breakeven')
  static const CreateJournalEntryBodyOutcomeEnum breakeven = _$createJournalEntryBodyOutcomeEnum_breakeven;
  @BuiltValueEnumConst(wireName: r'open')
  static const CreateJournalEntryBodyOutcomeEnum open = _$createJournalEntryBodyOutcomeEnum_open;
  @BuiltValueEnumConst(wireName: r'skipped')
  static const CreateJournalEntryBodyOutcomeEnum skipped = _$createJournalEntryBodyOutcomeEnum_skipped;

  static Serializer<CreateJournalEntryBodyOutcomeEnum> get serializer => _$createJournalEntryBodyOutcomeEnumSerializer;

  const CreateJournalEntryBodyOutcomeEnum._(String name): super(name);

  static BuiltSet<CreateJournalEntryBodyOutcomeEnum> get values => _$createJournalEntryBodyOutcomeEnumValues;
  static CreateJournalEntryBodyOutcomeEnum valueOf(String name) => _$createJournalEntryBodyOutcomeEnumValueOf(name);
}

