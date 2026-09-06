//
// AUTO-GENERATED FILE, DO NOT MODIFY!
//

// ignore_for_file: unused_element
import 'package:built_collection/built_collection.dart';
import 'package:trade_pilot_api_client/src/model/create_journal_entry_body_entry_price.dart';
import 'package:built_value/built_value.dart';
import 'package:built_value/serializer.dart';

part 'update_journal_entry_body.g.dart';

/// Partial update — every field is optional. Recomputes pnlAmount/pnlPercent/outcome from entry+exit+side when the user didn't pass an explicit override.
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
abstract class UpdateJournalEntryBody implements Built<UpdateJournalEntryBody, UpdateJournalEntryBodyBuilder> {
  @BuiltValueField(wireName: r'analysisId')
  int? get analysisId;

  @BuiltValueField(wireName: r'instrument')
  String? get instrument;

  @BuiltValueField(wireName: r'side')
  UpdateJournalEntryBodySideEnum? get side;
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
  UpdateJournalEntryBodyOutcomeEnum? get outcome;
  // enum outcomeEnum {  win,  loss,  breakeven,  open,  skipped,  };

  @BuiltValueField(wireName: r'mood')
  String? get mood;

  @BuiltValueField(wireName: r'note')
  String? get note;

  @BuiltValueField(wireName: r'tradedAt')
  DateTime? get tradedAt;

  UpdateJournalEntryBody._();

  factory UpdateJournalEntryBody([void updates(UpdateJournalEntryBodyBuilder b)]) = _$UpdateJournalEntryBody;

  @BuiltValueHook(initializeBuilder: true)
  static void _defaults(UpdateJournalEntryBodyBuilder b) => b;

  @BuiltValueSerializer(custom: true)
  static Serializer<UpdateJournalEntryBody> get serializer => _$UpdateJournalEntryBodySerializer();
}

class _$UpdateJournalEntryBodySerializer implements PrimitiveSerializer<UpdateJournalEntryBody> {
  @override
  final Iterable<Type> types = const [UpdateJournalEntryBody, _$UpdateJournalEntryBody];

  @override
  final String wireName = r'UpdateJournalEntryBody';

  Iterable<Object?> _serializeProperties(
    Serializers serializers,
    UpdateJournalEntryBody object, {
    FullType specifiedType = FullType.unspecified,
  }) sync* {
    if (object.analysisId != null) {
      yield r'analysisId';
      yield serializers.serialize(
        object.analysisId,
        specifiedType: const FullType(int),
      );
    }
    if (object.instrument != null) {
      yield r'instrument';
      yield serializers.serialize(
        object.instrument,
        specifiedType: const FullType(String),
      );
    }
    if (object.side != null) {
      yield r'side';
      yield serializers.serialize(
        object.side,
        specifiedType: const FullType(UpdateJournalEntryBodySideEnum),
      );
    }
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
        specifiedType: const FullType(UpdateJournalEntryBodyOutcomeEnum),
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
    UpdateJournalEntryBody object, {
    FullType specifiedType = FullType.unspecified,
  }) {
    return _serializeProperties(serializers, object, specifiedType: specifiedType).toList();
  }

  void _deserializeProperties(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
    required List<Object?> serializedList,
    required UpdateJournalEntryBodyBuilder result,
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
            specifiedType: const FullType.nullable(String),
          ) as String?;
          if (valueDes == null) continue;
          result.instrument = valueDes;
          break;
        case r'side':
          final valueDes = serializers.deserialize(
            value,
            specifiedType: const FullType.nullable(UpdateJournalEntryBodySideEnum),
          ) as UpdateJournalEntryBodySideEnum?;
          if (valueDes == null) continue;
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
            specifiedType: const FullType.nullable(UpdateJournalEntryBodyOutcomeEnum),
          ) as UpdateJournalEntryBodyOutcomeEnum?;
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
  UpdateJournalEntryBody deserialize(
    Serializers serializers,
    Object serialized, {
    FullType specifiedType = FullType.unspecified,
  }) {
    final result = UpdateJournalEntryBodyBuilder();
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

class UpdateJournalEntryBodySideEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'buy')
  static const UpdateJournalEntryBodySideEnum buy = _$updateJournalEntryBodySideEnum_buy;
  @BuiltValueEnumConst(wireName: r'sell')
  static const UpdateJournalEntryBodySideEnum sell = _$updateJournalEntryBodySideEnum_sell;

  static Serializer<UpdateJournalEntryBodySideEnum> get serializer => _$updateJournalEntryBodySideEnumSerializer;

  const UpdateJournalEntryBodySideEnum._(String name): super(name);

  static BuiltSet<UpdateJournalEntryBodySideEnum> get values => _$updateJournalEntryBodySideEnumValues;
  static UpdateJournalEntryBodySideEnum valueOf(String name) => _$updateJournalEntryBodySideEnumValueOf(name);
}

class UpdateJournalEntryBodyOutcomeEnum extends EnumClass {

  @BuiltValueEnumConst(wireName: r'win')
  static const UpdateJournalEntryBodyOutcomeEnum win = _$updateJournalEntryBodyOutcomeEnum_win;
  @BuiltValueEnumConst(wireName: r'loss')
  static const UpdateJournalEntryBodyOutcomeEnum loss = _$updateJournalEntryBodyOutcomeEnum_loss;
  @BuiltValueEnumConst(wireName: r'breakeven')
  static const UpdateJournalEntryBodyOutcomeEnum breakeven = _$updateJournalEntryBodyOutcomeEnum_breakeven;
  @BuiltValueEnumConst(wireName: r'open')
  static const UpdateJournalEntryBodyOutcomeEnum open = _$updateJournalEntryBodyOutcomeEnum_open;
  @BuiltValueEnumConst(wireName: r'skipped')
  static const UpdateJournalEntryBodyOutcomeEnum skipped = _$updateJournalEntryBodyOutcomeEnum_skipped;

  static Serializer<UpdateJournalEntryBodyOutcomeEnum> get serializer => _$updateJournalEntryBodyOutcomeEnumSerializer;

  const UpdateJournalEntryBodyOutcomeEnum._(String name): super(name);

  static BuiltSet<UpdateJournalEntryBodyOutcomeEnum> get values => _$updateJournalEntryBodyOutcomeEnumValues;
  static UpdateJournalEntryBodyOutcomeEnum valueOf(String name) => _$updateJournalEntryBodyOutcomeEnumValueOf(name);
}

